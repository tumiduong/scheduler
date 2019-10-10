export const SET_DAY = "SET_DAY";
export const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
export const SET_INTERVIEW = "SET_INTERVIEW";

export default function appReducer(state, action) {
  switch (action.type) {
    case SET_DAY:
      return { ...state, day: action.day }
    case SET_APPLICATION_DATA:
      return { ...state, days: action.days, appointments: action.appointments, interviewers: action.interviewers  }
    case SET_INTERVIEW:
        const appointmentDay = (days, id) => {
          for (const day of days) {
            if (day.appointments.includes(id)) {
              return day;
            }
          }
        }
        const appointmentArr = appointmentDay(state.days, action.id).appointments;
        const dayIndex = appointmentDay(state.days, action.id).id - 1;
  
        const spotCount = day => {
          let count = 0;
          appointmentArr.map(appointment => {
            if (!action.appointments[appointment].interview) {
              count += 1
            }
          })
          return count;
        }
  
        const spotUpdate = {
          ...state.days[dayIndex],
          spots: spotCount(state.days[dayIndex])
        }
        const dayUpdate = [
          ...state.days.slice(0, dayIndex), spotUpdate, ...state.days.slice(dayIndex + 1)
        ]

      return { ...state, appointments: action.appointments, days: dayUpdate}
    default:
      throw new Error(
        `Tried to reduce with unsupported action type: ${action.type}`
      );
  }
}