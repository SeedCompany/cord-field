// eslint-disable-next-line @seedcompany/no-restricted-imports
import { ClassNameMap } from '@material-ui/core/styles/withStyles';

/**
 * A helper to define classes prop to override component's classes.
 * Note that it's important that the useStyles() call gets the component's props passed in.
 *
 * To use:
 * ```
 * const useStyles = makeStyles(...);
 *
 * interface Props extends UseStyles<typeof useStyles> {
 *   ...
 * }
 * const Component = (props: Props) => {
 *   const classes = useStyles(props);
 * };
 * ```
 */
export interface UseStyles<T extends (props?: any) => ClassNameMap<any>> {
  classes?: Partial<ReturnType<T>>;
}
