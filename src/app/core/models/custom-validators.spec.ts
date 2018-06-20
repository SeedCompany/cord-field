import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DateTime } from 'luxon';
import { CustomValidators } from './custom-validators';


describe('CustomValidators', () => {
  describe('.dateRange', () => {
    let start: FormControl;
    let end: FormControl;
    let form: FormGroup;

    beforeEach(() => {
      start = new FormControl();
      end = new FormControl();
      form = new FormGroup({start, end}, {
        validators: CustomValidators.dateRange('start', 'end')
      });
    });

    const setValidRange = () =>
      form.setValue({
        start: DateTime.fromISO('2018-09-29T19:00:00.000'),
        end: DateTime.fromISO('2018-09-29T00:00:00.000')
      });

    const setInvalidRange = () =>
      form.setValue({
        start: DateTime.fromISO('2018-07-03'),
        end: DateTime.fromISO('2018-07-02')
      });

    const setSameDay = () =>
      form.setValue({
        start: DateTime.fromISO('2018-07-03'),
        end: DateTime.fromISO('2018-07-03')
      });

    it('Unknown field names throws error', () => {
      form.setValidators(CustomValidators.dateRange('unknown', 'end'));
      expect(setValidRange).toThrow(new Error('Form does not have control named: "unknown".'));

      form.setValidators(CustomValidators.dateRange('start', 'unknown2'));
      expect(setValidRange).toThrow(new Error('Form does not have control named: "unknown2".'));
    });

    it('Value other than DateTime or null throws error', () => {
      expect(() => start.setValue('asdf')).toThrow(new Error('Value is not an not a DateTime object.'));

      start.setValue('');
      start.setValue(null);
      start.setValue(undefined);
      start.setValue(DateTime.local());
    });

    it('Start date before end date is valid', () => {
      setValidRange();

      expect(start.valid).toBeTruthy();
      expect(end.valid).toBeTruthy();
      expect(form.valid).toBeTruthy();
    });

    it('Start date after end date is invalid', () => {
      setInvalidRange();

      expect(start.hasError('invalidRange')).toBeTruthy();
      expect(end.hasError('invalidRange')).toBeTruthy();
      expect(form.hasError('invalidRange')).toBeTruthy();
    });

    it('Same date with same day allowed is valid', () => {
      setSameDay();

      expect(start.hasError('invalidRange')).toBeFalsy();
      expect(end.hasError('invalidRange')).toBeFalsy();
      expect(form.hasError('invalidRange')).toBeFalsy();
    });

    it('Same date with same day not allowed is invalid', () => {
      form.setValidators(CustomValidators.dateRange('start', 'end', false));
      setSameDay();

      expect(start.hasError('invalidRange')).toBeTruthy();
      expect(end.hasError('invalidRange')).toBeTruthy();
      expect(form.hasError('invalidRange')).toBeTruthy();
    });

    it('Valid range after invalid', () => {
      setInvalidRange();
      expect(start.hasError('invalidRange')).toBeTruthy();
      expect(end.hasError('invalidRange')).toBeTruthy();

      setValidRange();
      expect(start.hasError('invalidRange')).toBeFalsy();
      expect(end.hasError('invalidRange')).toBeFalsy();
      expect(form.hasError('invalidRange')).toBeFalsy();
    });

    it('Invalid range with other errors', () => {
      start.setValidators(Validators.pattern(/$.+/));
      end.setValidators(Validators.pattern(/$.+/));
      setInvalidRange();

      expect(start.hasError('invalidRange')).toBeTruthy();
      expect(end.hasError('invalidRange')).toBeTruthy();
      expect(start.hasError('pattern')).toBeTruthy();
      expect(end.hasError('pattern')).toBeTruthy();
    });

    it('Valid range after invalid with other errors', () => {
      start.setValidators(Validators.pattern(/$.+/));
      end.setValidators(Validators.pattern(/$.+/));
      setInvalidRange();
      setValidRange();

      expect(start.hasError('invalidRange')).toBeFalsy();
      expect(end.hasError('invalidRange')).toBeFalsy();
      expect(start.hasError('pattern')).toBeTruthy();
      expect(end.hasError('pattern')).toBeTruthy();
    });
  });
});
