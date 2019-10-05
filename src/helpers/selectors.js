export function getAppointmentsForDay(state, day) {
  const dayArr = state.days.filter(days => days.name === day);
  
  if (dayArr.length) {
    const appointmentsForDay = dayArr[0].appointments;
    const allAppointments = appointmentsForDay.map(appointmentId => state.appointments[appointmentId]);
    return allAppointments;
  }
  
  return dayArr;
}

export function getInterview(state, interview) {
  if (interview) {
    const interviewerId = interview.interviewer;
    return { ...interview, interviewer: state.interviewers[interviewerId] };
  }
  return interview;
}

export function getInterviewersForDay(state, day) {
  const dayArr = state.days.filter(days => days.name === day);
  
  if (dayArr.length) {
    const interviewersForDay = dayArr[0].interviewers;
    const allInterviewers = interviewersForDay.map(interviewerId => state.interviewers[interviewerId]);
    return allInterviewers;
  }
  
  return dayArr;
}