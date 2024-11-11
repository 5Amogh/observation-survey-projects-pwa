interface Environment {
  baseURL: string;
  production: boolean;
  surveyBaseURL?: string; 
  projectsBaseURL?:string;
  capabilities:'all' | 'project' | 'survey';
}

//projects and survey for non-docker
// export const environment:Environment = {
//   production: true,
//   baseURL: '<base-url>',
//   projectsBaseURL: '<project-base-url>',
//   surveyBaseURL: '<survey-base-url>'
// }s

//projects and survey for docker
export const environment:Environment = {
  production: true,
  baseURL: window['env' as any]['baseURL' as any] as unknown as string,
  projectsBaseURL: window['env' as any]['projectsBaseURL' as any] as unknown as string,
  surveyBaseURL: window['env' as any]['surveyBaseURL' as any] as unknown as string,
  capabilities:window['env' as any]['capabilities' as any] as unknown as any
}


//survey-only

// export const environment = {
//   production: true,
//   baseURL: "<survey-base-url>"
// };

//projects-only

// export const environment = {
//   production: true,
//   baseURL: "<projects-base-url>"
// };