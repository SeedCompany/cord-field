import { Children, ReactElement, ReactNode } from 'react';

/**
 * Allows a badge to have a tooltip.
 *
 * @example
 * <Badge
 *   component={BadgeWithTooltip}
 *   tooltip={(content: ReactElement) => (
 *     <Tooltip title="This is a badge">
 *       // This is the actual badge content.
 *       // It is whatever is given to Badge.children wrapped in another element.
 *       {content}
 *     </Tooltip>
 *   )}
 * >
 *   ...
 * </Badge>
 */
export const BadgeWithTooltip = ({
  tooltip,
  children: childrenProp,
  ...props
}: {
  tooltip: (content: ReactElement) => ReactElement;
  children: ReactNode;
}) => {
  const children = Children.toArray(childrenProp);
  return (
    <span {...props}>
      {children.slice(0, -1)}
      {tooltip(children[children.length - 1] as ReactElement)}
    </span>
  );
};
