type UiType = 'UiFormInputComponent' | 'UiFormSelectComponent' | 'UiFormDataComponentOptions' | 'UiDropdownSelectComponent' | 'UiFormInterstitial' | 'UiFormTable';
export type FormOption = {
  title: string,
  subtitle?: string | null,
  value: string,
  __typename: 'UiFormDataComponentOptions',
}
export type OnboardingFormElement = {
  ref: string;
  __typename: UiType;
  label?: string;
  placeholder?: string;
  type?: string;
  multiple?: boolean;
  options?: FormOption[];
  required: boolean,
  schema: {
    [key: string]: any;
  } | null
}

export type OnboardingStepRule = {
  ref: string,
  schema: any;
  __typename: 'UiFormRule',
}
export type OnboardingFormStep = {
  step_id: string;
  title: string;
  subtitle?: string;
  elements: OnboardingFormElement[];
  rule?: OnboardingStepRule | null
}
export type OnboardingForm = {
  form: {
    steps: OnboardingFormStep[];
  }
  schema: any;
}
