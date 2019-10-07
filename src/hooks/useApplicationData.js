import { useEffect, useReducer } from "react";
import axios from "axios";

const SET_DAY = "SET_DAY";
const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
const SET_INTERVIEW = "SET_INTERVIEW";
const SET_SPOTS = "SET_SPOTS";

function appReducer(state, action) {
  switch (action.type) {
    case SET_DAY:
      return { ...state, day: action.day }
    case SET_APPLICATION_DATA:
      return { ...state, days: action.days, appointments: action.appointments, interviewers: action.interviewers  }
    case SET_INTERVIEW:
      return { ...state, appointments: action.appointments }
    case SET_SPOTS:
      const spotDay = (days, id) => {
        for (const day of days) {
          if (day.appointments.includes(id)) {
            return day;
          }
        }
      }
      const dayIndex = spotDay(state.days, action.id).id - 1;
      const spotUpdate = {
        ...state.days[dayIndex],
        spots: state.days[dayIndex].spots + action.value
      }
      const dayUpdate = [
        ...state.days.slice(0, dayIndex), spotUpdate, ...state.days.slice(dayIndex + 1)
      ]
      return { ...state, days: dayUpdate }
    default:
      throw new Error(
        `Tried to reduce with unsupported action type: ${action.type}`
      );
  }
}

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
        dispatch({ type: SET_INTERVIEW, appointments })
        dispatch({ type: SET_SPOTS, id, value: -1 })
      })
      .catch(err => console.log(err))
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
        dispatch({ type: SET_INTERVIEW, appointments })
        dispatch({ type: SET_SPOTS, id, value: 1 })
      })
      .catch(err => console.log(err))
  }
  
  return { state, setDay, bookInterview, cancelInterview }
}