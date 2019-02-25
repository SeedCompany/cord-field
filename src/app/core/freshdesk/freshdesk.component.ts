import { Component, OnDestroy, OnInit } from '@angular/core';
import { User } from '@app/core/models/user';
import { AuthenticationService } from '@app/core/services/authentication.service';
import { SubscriptionComponent } from '@app/shared/components/subscription.component';
import { combineLatest } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

interface FreshWidget {
  init(ignored: string, options: FreshWidgetInitOptions): void;
  create(): void;
  show(): void;
  close(): void;
  iframe(): HTMLIFrameElement;
  update(something: any): void;
  destroy(): void;
}

interface FreshWidgetInitOptions {
  url?: string;
  widgetType?: string;
  buttonType?: string;
  buttonText?: string;
  buttonColor?: string;
  buttonBg?: string;
  alignment?: string;
  offset?: string;
  formHeight?: string;
  queryString?: string;
  utf8?: string;
  loadOnEvent?: string;
}

@Component({
  selector: 'app-freshdesk',
  templateUrl: './freshdesk.component.html',
  styleUrls: ['./freshdesk.component.scss'],
})
export class FreshdeskComponent extends SubscriptionComponent implements OnInit, OnDestroy {

  private $widgetAttr: any;
  private $widgetAttrInitial = {};

  constructor(private authenticationService: AuthenticationService) {
    super();
  }

  ngOnInit() {
    combineLatest(
      this.widget(),
      this.authenticationService.getCurrentUser(),
    )
      .pipe(
        takeUntil(this.unsubscribe),
      )
      .subscribe(([widget, user]: [FreshWidget, User | null]) => {
        // Grab reference to widget's private variable where it stores references to elements
        this.$widgetAttr = (function() {
          // tslint:disable-next-line:no-eval
          return eval('$widget_attr');
        }).apply(widget);
        // And copy and store the initial values, to reset to on destroy
        this.$widgetAttrInitial = {...this.$widgetAttr};

        const params = {
          widgetType: 'popup',
          formTitle: 'Help & Support',
          submitTitle: 'Request Help',
          submitThanks: 'Thanks for sending in your request! A Support Team member will reach out to follow up shortly.',
          'helpdesk_ticket[requester]': user ? user.email : '', // Autofill requester
          'helpdesk_ticket[name]': user ? user.fullName : '', // Autofill name
          'helpdesk_ticket[custom_field][cf_category_915575]': 'Cord Field', // Autofill category
        };
        widget.init('', {
          url: 'https://seedcompany.freshdesk.com',
          queryString: new URLSearchParams(params as any).toString(),
          utf8: '✓',
          loadOnEvent: 'immediate',
        });

        // Hide the button the widget just added; we show our own
        // Don't delete it because it keeps a reference to it and that breaks the destroy() method.
        const btn = document.querySelector<HTMLButtonElement>('#freshwidget-button');
        if (btn) {
          btn.setAttribute('style', 'display:none !important');
        }
      });
  }

  ngOnDestroy() {
    super.ngOnDestroy();

    this.widget().then(widget => {
      widget.destroy();
      // Restore global variable it just deleted
      (window as any).FreshWidget = widget;
      // Restore its private state to what it was initially.
      // Otherwise iframe doesn't load/display correctly on next init & show.
      Object.assign(this.$widgetAttr, this.$widgetAttrInitial);
    });
  }

  async show() {
    const widget = await this.widget();
    widget.show();
    widget.iframe().focus();
  }

  private async widget(): Promise<FreshWidget> {
    // If already loaded return it
    if ('FreshWidget' in window) {
      return (window as any).FreshWidget;
    }

    // Grab script element or return empty if not found
    const script = document.querySelector('#freshdesk-script');
    if (!script) {
      throw new Error('Freskdesk script not required');
    }

    // Wait for load
    await new Promise(resolve => {
      const onLoad = () => {
        script.removeEventListener('load', onLoad);
        resolve();
      };
      script.addEventListener('load', onLoad);
    });

    return (window as any).FreshWidget;
  }
}
