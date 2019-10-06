import React, { Fragment } from "react";
import "components/Appointment/styles.scss";
import Header from "components/Appointment/Header";
import Show from "components/Appointment/Show";
import Empty from "components/Appointment/Empty";
import Form from "components/Appointment/Form";
import Status from "components/Appointment/Status";
import Confirm from "components/Appointment/Confirm";
import Error from "components/Appointment/Error";
import useVisualMode from "hooks/useVisualMode";

export default function Appointment(props) {
  const EMPTY = "EMPTY";
  const SHOW = "SHOW";
  const CREATE = "CREATE";
  const SAVING = "SAVING";
  const CONFIRM = "CONFIRM";
  const DELETING = "DELETING";
  const EDIT = "EDIT";
  const ERROR_SAVE = "ERROR_SAVE";
  const ERROR_DELETE = "ERROR_DELETE";

  const { mode, transition, back } = useVisualMode(
    props.interview ? SHOW : EMPTY
  );

  function save(name, interviewer) {
    const interview = {
      student: name,
      interviewer
    };

    transition(SAVING);

    Promise.resolve(props.bookInterview(props.id, interview))
      .then(() => transition(SHOW))
      .catch(error => transition(ERROR_SAVE, true))
  }

  function cancel() {

    transition(DELETING, true);
    
    Promise.resolve(props.cancelInterview(props.id))
      .then(() => transition(EMPTY))
      .catch(error => transition(ERROR_DELETE, true))
  }

  return (
    <Fragment>
      <Header time={props.time}/>
        {mode === EMPTY && (
        <Empty
        onAdd={() => transition(CREATE)}
        />)}
        {mode === SHOW && (
          <Show
            student={props.interview.student}
            interviewer={props.interview.interviewer.name}
            onDelete={() => transition(CONFIRM)}
            onEdit={() => transition(EDIT)}
          />
        )}
       {mode === CREATE && (
         <Form
         interviewers={props.interviewers}
         onCancel={() => back()}
         onSave={(name, interviewer) => { save(name, interviewer) }}
         />
       )}
       {mode === SAVING && (
         <Status
         message="Saving"
         />
       )}
       {mode === CONFIRM && (
         <Confirm
         message="Are you sure you would like to delete?"
         onCancel={() => back()}
         onConfirm={() => cancel()}
         />
       )}
       {mode === DELETING && (
         <Status
         message="Deleting"
         />
       )}
       {mode === EDIT && (
         <Form
         name={props.interview.student}
         interviewers={props.interviewers}
         interviewer={props.interview.interviewer.id}
         onCancel={() => back()}
         onSave={(name, interviewer) => { save(name, interviewer) }}
         />
       )}
       {mode === ERROR_SAVE && (
         <Error
         message="Could not save appointment."
         />
       )}
       {mode === ERROR_DELETE && (
         <Error
         message="Could not delete appointment."
         />
       )}
    </Fragment>
  );
}