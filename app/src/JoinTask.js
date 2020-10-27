import * as React from "react";
import {
  useCreateController,
  SimpleForm,
  Form,
  List,
  Create,
  Datagrid,
  DateField,
  TextField,
  TextInput,
  DateInput
} from 'react-admin';
// import BookIcon from '@material-ui/core/svg-icons/action/book';
// export const PostIcon = BookIcon;

export const JoinTaskList = (props) => (
    <List {...props}>
        <Datagrid>created, last_run, invite_code, state
            <DateField source="created" showTime="true" />
            <DateField source="last_run" showTime="true" />
            <TextField source="invite_code" />
            <TextField source="state" />
        </Datagrid>
    </List>
);

const MyCreate = props => {
    const {
        basePath, // deduced from the location, useful for action buttons
        defaultTitle, // the translated title based on the resource, e.g. 'Create Post'
        record, // empty object, unless some values were passed in the location state to prefill the form
        redirect, // the default redirection route. Defaults to 'edit', unless the resource has no edit view, in which case it's 'list'
        resource, // the resource name, deduced from the location. e.g. 'posts'
        save, // the create callback, to be passed to the underlying form as submit handler
        saving, // boolean that becomes true when the dataProvider is called to create the record
        version, // integer used by the refresh feature
    } = useCreateController(props);
    return (
        <div>
            <h1>{defaultTitle}</h1>
            <SimpleForm {...props}>
                <TextInput title="Group Link" source="group_link"/>
            </SimpleForm>
        </div>
    );
}

export const JoinTaskCreate = props => (
    <MyCreate {...props}>
    </MyCreate>
)

/*export const JoinTaskCreate = (props) => (
    <Create {...props}>
        <SimpleForm>
            <TextInput label="WhatsApp Group Link" source="group_link" type="email" />
        </SimpleForm>
    </Create>
);
*/
