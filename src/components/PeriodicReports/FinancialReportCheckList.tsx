import {
  Checkbox,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
} from '@material-ui/core';
import { EditOutlined } from '@material-ui/icons';
import React, { useMemo } from 'react';
import { useNavigate } from 'react-router';
import { ProjectOverviewFragment } from '../../scenes/Projects/Overview/ProjectOverview.generated';
import {
  EditableProjectField,
  UpdateProjectDialog,
} from '../../scenes/Projects/Update';
import { Many } from '../../util';
import { useDialog } from '../Dialog';

export const FinancialReportCheckList = ({
  project,
}: {
  project: ProjectOverviewFragment;
}) => {
  const [editState, editField, fieldsBeingEdited] =
    useDialog<Many<EditableProjectField>>();
  const navigate = useNavigate();

  const checkList = useMemo(() => {
    const result = [];
    result.push({
      label: `Define the project's date range`,
      checked: !!project.mouRange.value.start && !!project.mouRange.value.end,
      action: () => editField('mouRange'),
    });
    result.push({
      label: 'Add a managing partner',
      checked: project.partnerships.total > 0,
      action: () => navigate('../../partnerships'),
    });
    result.push({
      label: `Set the managing partner's reporting frequency`,
      checked: !!project.financialReportPeriod.value,
      action: () => navigate('../../partnerships'),
    });
    return result;
  }, [editField, navigate, project]);

  return (
    <>
      <List>
        {checkList.map((item, index) => (
          <ListItem
            key={`check-list-${index}`}
            disabled={item.checked}
            dense
            button
            onClick={item.action}
          >
            <ListItemIcon>
              <Checkbox edge="start" checked={item.checked} />
            </ListItemIcon>
            <ListItemText primary={item.label} />
            {!item.checked && (
              <ListItemSecondaryAction>
                <IconButton edge="end" aria-label="edit">
                  <EditOutlined />
                </IconButton>
              </ListItemSecondaryAction>
            )}
          </ListItem>
        ))}
      </List>
      <UpdateProjectDialog
        {...editState}
        project={project}
        editFields={fieldsBeingEdited}
      />
    </>
  );
};
