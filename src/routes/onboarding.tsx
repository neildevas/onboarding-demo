import {
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  Spinner,
  Text, VStack,
  useRadio, useRadioGroup, RadioProps,
} from "@chakra-ui/react";
import React, {useCallback, useEffect, useState} from "react";
import {onboardingForm, schema} from "../data/mock-onboarding-form";
import {OnboardingFormElement, OnboardingForm, OnboardingFormStep, FormOption} from "../types/onboarding";
import {ErrorMessage, Field, FieldProps, Form, Formik, useFormikContext} from "formik";
import Ajv from "ajv";
import UiFormTable from "../components/UiFormTable";
import UiDropdownSelect from "../components/UiDropdownSelect";
import {Simulate} from "react-dom/test-utils";
import submit = Simulate.submit;

interface FormData {
  [key: string]: string | number | string[] | undefined;
}

const ajv = new Ajv();

function Onboarding() {
  const [form, setForm] = useState<OnboardingForm | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [didSubmitForm, setDidSubmitForm] = useState<boolean>(false);
  const [ajvInstance, setAjvInstance] = useState(new Ajv());
  const [submittedData, setSubmittedData] = useState<FormData>({});

  useEffect(() => {
    // pretend that an API call happens here
    // load the form
    const fetchedForm = onboardingForm;
    const fetchedSchema = schema;
    setForm({ form: fetchedForm, schema: fetchedSchema });
  }, []);

  useEffect(() => {
    if (!form?.schema) return;
    const newAjv = ajv.addSchema(form.schema);
    setAjvInstance(newAjv);
  }, [form?.schema])

  const submitForm = (values: FormData) => {
    // make API call;
    setSubmittedData(values);
    setDidSubmitForm(true);
  }

  const handleNext = useCallback((values: FormData) => {
    if (!form) return;
    const { steps } = form.form;
    let stepIndexToGoTo = currentStepIndex + 1;
    if (stepIndexToGoTo >= steps.length) {
      return submitForm(values);
    }
    let nextStep;
    // Iterate through steps until we find one that doesn't have a rule, or has one that validates
    while (stepIndexToGoTo <= steps.length - 1) {
      nextStep = steps[stepIndexToGoTo];
      if (!nextStep.rule) break;
      // Validate the rule of the next step in the list
      const fieldName = getPropertyFromRef(nextStep.rule.ref);
      const { schema } = nextStep.rule;
      // @ts-ignore
      const valid = ajvInstance.validate(schema, values[fieldName]);
      if (valid) break;
      stepIndexToGoTo++;
    }
    if (stepIndexToGoTo >= steps.length) {
      // we iterated through the whole form
      return submitForm(values);
    }
    setCurrentStepIndex(stepIndexToGoTo);
  }, [ajvInstance, form, currentStepIndex])

  const handleBack = useCallback((values: FormData) => {
    if (!form) return;
    const { steps } = form.form;
    if (currentStepIndex === 0) return;
    let stepIndexToGoTo = currentStepIndex - 1;
    let prevStep;
    while (stepIndexToGoTo >= 0) {
      prevStep = steps[stepIndexToGoTo];
      if (!prevStep.rule) break;
      const fieldName = getPropertyFromRef(prevStep.rule.ref);
      const { schema } = prevStep.rule;
      const valid = ajvInstance.validate(schema, values[fieldName])
      if (valid) break;
      stepIndexToGoTo--;
    }
    if (stepIndexToGoTo === 0) {
      // we iterated back to the beginning
      return setCurrentStepIndex(0);
    }
    setCurrentStepIndex(stepIndexToGoTo);
  }, [ajvInstance, form, currentStepIndex]);

  const handleOnSubmit = (values: any) => {
    console.log('Submitting with values', values);
  }

  const validateCurrentStep = useCallback((values: FormData) => {
    if (!form) return {};
    const errors = {};
    const stepElements = form.form.steps[currentStepIndex].elements.map(e => e.ref).filter(ref => !!ref);
    stepElements.forEach(ref => {
      const schemaUri = `${form.schema.$id}${ref}`;
      const validate = ajvInstance.getSchema(schemaUri);
      if (!validate) {
        console.log('Could not find schema for ', schemaUri);
        return;
      }
      const valid = validate(values[getPropertyFromRef(ref)]);
      if (!valid) {
        // @ts-ignore
        errors[getPropertyFromRef(ref)] = 'This field is invalid';
      }
    });
    return errors;
  }, [ajvInstance, currentStepIndex, form])

  const validate = (values: FormData) => {
    if (!form) return {};
    // TODO - on the last step, validate the entire form
    return validateCurrentStep(values);
  }

  return (
    <Flex height={'100vh'} direction={'column'}>
      <Box p={8}>
        <Heading size={'sm'}>Student Application Form</Heading>
      </Box>
      {didSubmitForm ? (
        <Box height={'100%'} width={'100%'} p={8}>
          <Box height={'100%'} w={'100%'}>
            <SubmitSuccessfulComponent data={submittedData} />
          </Box>
        </Box>
      ) : (
      <Box height={'100%'} width={'100%'} p={8}>
        {form ? (
          <Formik initialValues={{}} onSubmit={handleOnSubmit} validate={validate}>
            {({ values, errors }) => {
              return (
                <Form>
                  <Box height={'100%'} w={'800px'}>
                    <FormStep step={form.form.steps[currentStepIndex]} />
                    <Flex direction={'row'} justifyContent={'space-between'} pt={20}>
                      <Button onClick={() => handleBack(values)} isDisabled={currentStepIndex === 0}>Back</Button>
                      <Button
                        onClick={() => handleNext(values)}
                        isDisabled={Object.keys(validateCurrentStep(values)).length !== 0}
                        colorScheme="blue"
                        _disabled={{ bg: 'gray.400', cursor: 'not-allowed' }}>
                         Next
                      </Button>
                    </Flex>
                  </Box>
                </Form>
              )
            }}
          </Formik>
        ) : (<Loading />)}
      </Box>
      )}
    </Flex>
  );
}

const getPropertyFromRef = (ref: string) => {
  const regex = /[^/]+$/;
  const match = ref.match(regex);
  return match ? match[0] : '';
}

type FormStepProps = {
  step: OnboardingFormStep;
}

const Loading = () => (
  <Box>
    <Spinner />
    <Text>Loading application</Text>
  </Box>
)

const FormStep = ({ step }: FormStepProps) => {
  return (
      <Box>
        <Heading size={'md'} pb={'4'}>{step.title}</Heading>
        {step.subtitle ? (<Text pb={'4'}>{step.subtitle}</Text>) : null}
        {step.elements.map((element, index) => {
          const { ref } = element;
          const elementKey = getPropertyFromRef(ref);
          switch (element.__typename) {
            case 'UiFormTable':
              return (
                <UiFormTable options={element.options ?? []} />
              )
            case "UiFormInterstitial":
              return (
                <Box>
                  <Heading size={'sm'}>{element.label}</Heading>
                </Box>
              )
            case 'UiDropdownSelectComponent':
              return (
                <Field name={elementKey} key={index}>
                  {({ field, form }: FieldProps<FormData>) => {
                    return (
                      <FormControl isInvalid={!!form.errors[elementKey]}>
                        <FormLabel htmlFor={elementKey}>
                          {element.label}
                        </FormLabel>
                        {/* @ts-ignore */}
                        <UiDropdownSelect options={element.options} onChange={(val) => form.setFieldValue(elementKey, val)} />
                        <FormErrorMessage>
                          <ErrorMessage name={elementKey} />
                        </FormErrorMessage>
                      </FormControl>
                    )
                  }}
                </Field>
              )
            case "UiFormInputComponent":
              return (
                <Field name={elementKey} key={index}>
                  {({ field, form }: FieldProps<FormData>) => {
                    return (
                      <FormControl isInvalid={!!form.errors[elementKey]}>
                        <FormLabel htmlFor={elementKey}>
                          {element.label}
                        </FormLabel>
                        {/* @ts-ignore */}
                        <Input {...field} value={field.value ?? ''} placeholder={element.placeholder ?? ''} id={elementKey} />
                        <FormErrorMessage>
                          <ErrorMessage name={elementKey} />
                        </FormErrorMessage>
                      </FormControl>
                    )
                  }}
                </Field>
              )
            case 'UiFormSelectComponent':
              return (
                <Field name={elementKey} key={index}>
                  {({ field, form }: FieldProps<FormData>) => {
                    return (
                      <FormControl isInvalid={!!form.errors[elementKey]}>
                        <FormLabel htmlFor={elementKey}>
                          {element.label}
                        </FormLabel>
                        {/* @ts-ignore */}
                        <CustomRadioGroup
                          element={element}
                          onChange={(val) => form.setFieldValue(elementKey, val)}
                          // @ts-ignore
                          value={field.value}
                        />
                        <FormErrorMessage>
                          <ErrorMessage name={elementKey} />
                        </FormErrorMessage>
                      </FormControl>
                    )
                  }}
                </Field>
              )
            default:
              throw new Error('not implemented')
          }
        })}
      </Box>
  )
};

const CustomRadioGroup = ({ element, onChange, value }: { element: OnboardingFormElement; onChange: (value: string) => void; value?: string | undefined }) => {
  const name = getPropertyFromRef(element.ref);
  const { getRadioProps, getRootProps } = useRadioGroup({ name, onChange, defaultValue: value });
  const group = getRootProps();
  return (
    <VStack spacing={'24px'} alignItems={'flex-start'} {...group}>
      {(element.options ?? []).map((option) => {
        const radio = getRadioProps({ value: option.value });
        return (
          <CustomRadioButton key={option.value} {...radio}>
            {option.title}
          </CustomRadioButton>
        )
      })}
    </VStack>
  )
}

const CustomRadioButton = (props: RadioProps) => {
  const { getInputProps, getRadioProps } = useRadio(props)
  const input = getInputProps();
  const checkbox = getRadioProps();
  return (
    <Box as='label'>
      <input {...input} />
      <Box
        {...checkbox}
        cursor='pointer'
        borderWidth='1px'
        borderRadius='md'
        boxShadow='md'
        _checked={{
          bg: 'blue.500',
          color: 'white',
          borderColor: 'teal.600',
        }}
        _focus={{
          boxShadow: 'outline',
        }}
        px={5}
        py={3}
      >
        {props.children}
      </Box>
    </Box>
  )
}

const SubmitSuccessfulComponent = ({ data }: { data: FormData }) => {
  const submittedDataFormatted: FormOption[] = Object.keys(data).map(key => {
    return { title: key, value: `${data[key] ?? ''}` , __typename: 'UiFormDataComponentOptions' }
  });

  return (
    <Box w={'100%'}>
      <Flex direction={'row'}>
        <Flex direction={'column'} flex={1}>
          <Heading size={'md'} pb={'4'}>Thank you for submitting your application!</Heading>
          <Text pb={'4'}>We will get back to you within 2 weeks</Text>
        </Flex>
        <Flex flex={1} direction={'column'}>
          <Heading size={'md'} pb={'4'}>Your submitted data:</Heading>
          <UiFormTable options={submittedDataFormatted} />
        </Flex>
      </Flex>

    </Box>
  )
}

export default Onboarding;
