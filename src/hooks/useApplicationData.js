import { useEffect, useReducer } from "react";
import axios from "axios";
import { actions } from "@storybook/addon-actions/dist/preview";
import appReducer, {
  SET_DAY,
  SET_APPLICATION_DATA,
  SET_INTERVIEW
} from "reducers/application";

export default function useApplicationData() {
  const [state, dispatch] = useReducer(appReducer, {
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  })

  const setDay = day => dispatch({ type: SET_DAY, day })

  useEffect(() => {

    const getDays = axios.get('/api/days');
    const getAppointments = axios.get('/api/appointments');
    const getInterviewers = axios.get('/api/interviewers');

    Promise.all([getDays, getAppointments, getInterviewers])
      .then((all) => {
        dispatch({ type: SET_APPLICATION_DATA , days: all[0].data, appointments: all[1].data, interviewers: all[2].data })
      })
      .catch(err => console.log(err))
  }, [])

  function bookInterview(id, interview) {
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };

    const appointments = {
      ...state.appointments,
      [id]: appointment
    };

    return axios
      .put(`/api/appointments/${id}`, {interview})
      .then(() => {
        dispatch({ type: SET_INTERVIEW, appointments, id })
      })
      .catch(err => {throw err})
  }

  function cancelInterview(id) {
    const appointment = {
      ...state.appointments[id],
      interview: null
    };

    const appointments = {
      ...state.appointments,
      [id]: appointment
    };

    return axios
      .delete(`/api/appointments/${id}`)
      .then(() => {
        dispatch({ type: SET_INTERVIEW, appointments, id })
      })
      .catch(err => {throw err})
  }
  
  return { state, setDay, bookInterview, cancelInterview }
}