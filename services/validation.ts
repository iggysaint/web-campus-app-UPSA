
export const validate = {
  required: (val: any) => !!val && (typeof val === 'string' ? val.trim().length > 0 : true),
  email: (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
  futureDate: (dateStr: string) => new Date(dateStr) > new Date(),
  timeFormat: (timeStr: string) => /^([01]\d|2[0-3]):?([0-5]\d)$/.test(timeStr),
  
  announcement: (data: any) => {
    if (!validate.required(data.title)) throw new Error('Title is required');
    if (!validate.required(data.message)) throw new Error('Message is required');
    if (data.title.length < 5) throw new Error('Title must be at least 5 characters');
  },
  
  schedule: (data: any) => {
    if (!validate.required(data.course_id)) throw new Error('Course ID is required');
    if (!validate.required(data.course_name)) throw new Error('Course name is required');
    if (!validate.timeFormat(data.start_time)) throw new Error('Invalid start time format');
    if (!validate.timeFormat(data.end_time)) throw new Error('Invalid end time format');
  },
  
  poll: (data: any) => {
    if (!validate.required(data.question)) throw new Error('Question is required');
    if (!data.options || data.options.filter((o: string) => o.trim()).length < 2) {
      throw new Error('At least two valid options are required');
    }
  }
};
