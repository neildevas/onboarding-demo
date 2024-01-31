import {
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  RadioProps,
  Spinner,
  Text,
  useRadio,
  useRadioGroup,
  VStack,
} from "@chakra-ui/react";
import React, {useCallback, useEffect, useState} from "react";
import {onboardingForm, schema} from "../data/mock-onboarding-form";
import {FormOption, OnboardingForm, OnboardingFormElement, OnboardingFormStep} from "../types/onboarding";
import {ErrorMessage, Field, FieldProps, Form, Formik} from "formik";
import Ajv, {DefinedError, JSONSchemaType} from "ajv";
import UiFormTable from "../components/UiFormTable";
import UiDropdownSelect from "../components/UiDropdownSelect";
import {merge} from 'lodash'
import JSONPretty from 'react-json-pretty';
import {getPropertyFromRef, recursivelyAppendToSchema} from "../utils";

interface FormData {
  [key: string]: string | number | string[] | undefined;
}

const ajv = new Ajv();

function Onboarding() {
  const [form, setForm] = useState<OnboardingForm | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [didSubmitForm, setDidSubmitForm] = useState<boolean>(false);
  const [submittedData, setSubmittedData] = useState<FormData>({});
  const [newGeneratedSchema, setNewGeneratedSchema] = useState<JSONSchemaType<any>>({ type: 'object' });
  const [stateFormValues, setStateFormValues] = useState<FormData>({});

  useEffect(() => {
    console.log('new generaetd schema', newGeneratedSchema);
  }, [newGeneratedSchema]);

  useEffect(() => {
    if (!form) return;

    // iterate through all steps until current
    // constructing the form
    let newSchema = {};
    for (let i = 0; i<=currentStepIndex; i++) {
      const formStep = form.form.steps[i];
      // make sure that the step will be shown based on the rule
      const { rule } = formStep;
      if (rule) {
        const fieldName = getPropertyFromRef(rule.ref);
        const { schema } = rule;
        // @ts-ignore
        const valid = ajv.validate(schema, stateFormValues[fieldName]);
        if (!valid) continue; // if a step shouldn't be shown based on the form state, don't include it in the schema creation
      }
      const formStepSchemas = formStep.elements.map(it => { const { ref, required, schema } = it; return { ref, required, schema } });
      formStepSchemas.forEach(it => {
        if (!it.ref) return;
        const fullRef = it.ref.substring(2);
        newSchema = recursivelyAppendToSchema(fullRef, it.schema, it.required, 0, newSchema);
      });
    }
    // @ts-ignore
    setNewGeneratedSchema(newSchema);
  }, [currentStepIndex, form, stateFormValues]);

  useEffect(() => {
    // pretend that an API call happens here
    // load the form
    const fetchedForm = onboardingForm;
    const fetchedSchema = schema;
    setForm({ form: fetchedForm, schema: fetchedSchema });
  }, []);

  const submitForm = (values: FormData) => {
    // make API call;
    setSubmittedData(values);
    setDidSubmitForm(true);
  }

  const handleNext = useCallback((values: FormData) => {
    setStateFormValues(values);
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
      const valid = ajv.validate(schema, values[fieldName]);
      if (valid) break;
      stepIndexToGoTo++;
    }
    if (stepIndexToGoTo >= steps.length) {
      // we iterated through the whole form
      return submitForm(values);
    }
    setCurrentStepIndex(stepIndexToGoTo);
  }, [form, currentStepIndex])

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
      const valid = ajv.validate(schema, values[fieldName])
      if (valid) break;
      stepIndexToGoTo--;
    }
    if (stepIndexToGoTo === 0) {
      // we iterated back to the beginning
      return setCurrentStepIndex(0);
    }
    setCurrentStepIndex(stepIndexToGoTo);
  }, [form, currentStepIndex]);

  const handleOnSubmit = (values: any) => {
    console.log('Submitting with values', values);
  }

  const validateCurrentStep = useCallback((values: FormData) => {
    if (!form) return {};
    const errors = {};
    const isValid = ajv.validate(newGeneratedSchema, values);
    if (!isValid && ajv.errors?.length) {
      for (const err of ajv.errors as DefinedError[]) {
        switch(err.keyword) {
          case 'required':
            const { missingProperty } = err.params;
            // @ts-ignore
            errors[missingProperty] = err.message ?? 'This field is invalid';
            break;
          default:
            const { instancePath, message } = err;
            // @ts-ignore
            errors[instancePath.replaceAll('/', '')] = message ?? 'This field is invalid';
            break;
        }
      }
    }
    return errors;
  }, [form, newGeneratedSchema])

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
          console.log('ELEMENT KEY', elementKey);
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
  return (
    <Box w={'100%'}>
      <Flex direction={'row'}>
        <Flex direction={'column'} flex={1}>
          <Heading size={'md'} pb={'4'}>Thank you for submitting your application!</Heading>
          <Text pb={'4'}>We will get back to you within 2 weeks</Text>
        </Flex>
        <Flex flex={1} direction={'column'}>
          <Heading size={'md'} pb={'4'}>Your submitted data:</Heading>
          <JSONPretty data={data} />
        </Flex>
      </Flex>

    </Box>
  )
}

export default Onboarding;
