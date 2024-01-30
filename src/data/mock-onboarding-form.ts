import type { OnboardingForm } from '../types/onboarding';

export const schema: OnboardingForm['schema'] = {
  $id: 'onboarding_form',
  title: 'Student Onboarding Form',
  description: 'A student application form containing both generic onboarding information, and questions specific to the program the student wants to apply for.',
  type: 'object',
  properties: {
    address: {
      type: 'object',
      required: [
        'line1',
        'city',
        'state',
        'zipCode',
      ],
      properties: {
        line1: {
          type: 'string',
          minLength: 1
        },
        line2: {
          type: 'string',
        },
        city: {
          type: 'string',
          minLength: 1,
        },
        state: {
          type: 'string',
          minLength: 1,
        },
        zipCode: {
          type: 'string',
          pattern: '^[0-9]{5}$',
          minLength: 1,
        },
      },
    },
    full_name: {
      $id: 'full_name',
      description: "The student's full name",
      type: 'string',
      minLength: 1, // Ensure that the field is not empty
    },
    birthday: {
      $id: 'birthday',
      description: "The student's birthday",
      type: 'string',
      pattern: '^(0[1-9]|1[012])/(0[1-9]|[12][0-9]|3[01])/(19|20)[0-9]{2}$',
    },
    application_type: {
      $id: 'application_type',
      description: 'The program the student is applying for',
      enum: ['pharmacy_tech', 'medical_assistant'],
    },
    medical_assistant_availability: {
      $id: 'medical_assistant_availability',
      type: 'string',
    },
    pharmacy_tech_availability: {
      $id: 'pharmacy_tech_availability',
      type: 'string',
    }
  },
  required: ['full_name', 'birthday', 'application_type'],
  allOf: [{
    if: {
      properties: {
        application_type: { const: 'pharmacy_tech' }
      },
      required: ['application_type']
    },
    then: {
      required: ['pharmacy_tech_availability']
    }
  }, {
    if: {
      properties: {
        application_type: { const: 'medical_assistant'},
      },
      required: ['application_type']
    },
    then: {
      required: ['medical_assistant_availability']
    }
  }]
};

export const onboardingForm: OnboardingForm['form'] = {
  steps: [{
    step_id: 'welcome_interstitial',
    title: 'Welcome to Stepful!',
    elements: [{
      ref: '',
      schema: null,
      __typename: 'UiFormInterstitial',
      label: "We're excited to have you here. Begin by starting your application to apply to one of our online programs."
    }]
  },{
    step_id: 'application_type',
    title: 'Which program are you applying for?',
    subtitle: "Please select which program you'd like to apply for. You can only be enrolled in one program at a time.",
    elements: [{
      ref: '#/properties/application_type',
      schema: {
        required: true,
        enum: ['pharmacy_tech', 'medical_assistant']
      },
      __typename: 'UiFormSelectComponent',
      multiple: false,
      options: [{
        title: 'Pharmacy Tech',
        subtitle: null,
        value: 'pharmacy_tech',
        __typename: 'UiFormDataComponentOptions',
      }, {
        title: 'Medical Assistant',
        subtitle: null,
        value: 'medical_assistant',
        __typename: 'UiFormDataComponentOptions',
      }],
    }],
  }, {
    step_id: 'medical_assistant_facts_interstitial',
    title: 'Great! Stepful offers a top-tier medical assistant training program that can get you a degree in just 4 weeks.',
    subtitle: 'Here are the facts about becoming a medical assistant: ',
    elements: [{
      schema: null,
      ref: '',
      __typename: 'UiFormTable',
      options: [{
        title: 'Description',
        value: 'Assist doctors with administrative & clinical duties',
        __typename: 'UiFormDataComponentOptions'
      }, {
        title: 'Median Salary',
        value: '$38,270 per year',
        __typename: 'UiFormDataComponentOptions'
      }, {
        title: 'Proj job Growth',
        value: '14%',
        __typename: 'UiFormDataComponentOptions'
      }, {
        title: 'Job Location',
        value: 'Doctors offices, cliniics, outpatient centers, hospitals',
        __typename: 'UiFormDataComponentOptions'
      }, {
        title: 'Typical Hours',
        value: 'Monday through Friday, 7 am to 9 pm. Some nights, weekends, and holidays.',
        __typename: 'UiFormDataComponentOptions'
      }, {
        title: 'Training Required',
        value: 'Training program & certification required in some states',
        __typename: 'UiFormDataComponentOptions'
      }]
    }],
    rule: {
      ref: '#/properties/application_type',
      schema: {
        const: 'medical_assistant',
      },
      __typename: 'UiFormRule',
    }
  }, {
    step_id: 'pharmacy_tech_facts_interstitial',
    title: 'Great! Stepful offers a top-tier pharmacy technician training program that can get you a degree in just 4 weeks.',
    subtitle: 'Here are the facts about becoming a pharmacy technician: ',
    elements: [{
      ref: '',
      schema: null,
      __typename: 'UiFormTable',
      options: [{
        title: 'Description',
        value: 'Helps fill prescriptions under the guidance of a pharmacist',
        __typename: 'UiFormDataComponentOptions'
      }, {
        title: 'Median Salary',
        value: '$37,790 per year',
        __typename: 'UiFormDataComponentOptions'
      }, {
        title: 'Proj job Growth',
        value: '6%',
        __typename: 'UiFormDataComponentOptions'
      }, {
        title: 'Job Location',
        value: 'Retail, private, or mail-order pharmacies, hospitals, pharmacy laboratories',
        __typename: 'UiFormDataComponentOptions'
      }, {
        title: 'Typical Hours',
        value: 'Monday through Friday, 9 am to 6 pm. Some nights, weekends, and holidays.',
        __typename: 'UiFormDataComponentOptions'
      }, {
        title: 'Training Required',
        value: 'Training program & certification required in most states',
        __typename: 'UiFormDataComponentOptions'
      }]
    }],
    rule: {
      ref: '#/properties/application_type',
      schema: {
        const: 'pharmacy_tech',
      },
      __typename: 'UiFormRule',
    }
  }, {
    step_id: 'medical_assistant_availability',
    title: 'Which program dates can you join?',
    subtitle: 'These are the available dates for our Medical Assistant program. Dates vary across programs. Please select all that apply.',
    elements: [{
      ref: '#/properties/medical_assistant_availability',
      schema: {
        required: true, // conditionally required, rule will be taken into account
        type: 'string',
      },
      __typename: 'UiDropdownSelectComponent',
      multiple: true,
      options: [{
        title: 'February 22 - June 27, 2024',
        value: 'feb_22_2024',
        __typename: 'UiFormDataComponentOptions',
      }, {
        title: 'July 4 - November 4, 2024',
        value: 'july_4_2024',
        __typename: 'UiFormDataComponentOptions',
      }]
    }],
    rule: {
      ref: '#/properties/application_type',
      schema: {
        const: 'medical_assistant',
      },
      __typename: 'UiFormRule',
    }
  }, {
    step_id: 'pharmacy_tech_availability',
    title: 'Which program dates can you join?',
    subtitle: 'These are the available dates for our Pharmacy Technician program. Dates vary across programs. Please select all that apply.',
    elements: [{
      ref: '#/properties/pharmacy_tech_availability',
      schema: {
        required: true, // will be conditionally required based on the rule
        type: 'string',
      },
      __typename: 'UiDropdownSelectComponent',
      multiple: true,
      options: [{
        title: 'March 01 - July 03, 2024',
        value: 'feb_22_2024',
        __typename: 'UiFormDataComponentOptions',
      }, {
        title: 'August 6 - December 8, 2024',
        value: 'july_4_2024',
        __typename: 'UiFormDataComponentOptions',
      }]
    }],
    rule: {
      ref: '#/properties/application_type',
      schema: {
        const: 'pharmacy_tech',
      },
      __typename: 'UiFormRule',
    }
  }, {
    step_id: 'personal_info_interstitial',
    title: "Thanks!",
    elements: [{
      ref: '',
      schema: null,
      __typename: 'UiFormInterstitial',
      label: "Now, let's collect some personal info to complete the onboarding process"
    }]
  }, {
    step_id: 'full_name',
    title: 'What is your full name?',
    elements: [{
      ref: '#/properties/full_name',
      schema: {
        required: true,
        type: 'string',
        minLength: 1,
      },
      __typename: 'UiFormInputComponent',
      label: 'Full Name',
    }],
  }, {
    step_id: 'birthday',
    title: 'When is your birthday?',
    elements: [{
      ref: '#/properties/birthday',
      schema: {
        required: true,
        type: 'string',
        pattern: '^(0[1-9]|1[012])/(0[1-9]|[12][0-9]|3[01])/(19|20)[0-9]{2}$',
      },
      __typename: 'UiFormInputComponent',
      label: 'Date of Birth',
      placeholder: 'MM/DD/YYYY',
      type: 'DATE',
    }],
  },{
    step_id: 'address',
    title: 'Where is your permanent residence?',
    elements: [
      {
        ref: '#/properties/address/properties/line1',
        schema: {
          required: true,
          type: 'string',
          minLength: 1, // ideally we'd validate the address
        },
        __typename: 'UiFormInputComponent',
        label: 'Street Address',
        placeholder: 'Address',
        type: 'TEXT',
      },
      {
        ref: '#/properties/address/properties/line2',
        schema: {
          required: false,
          type: 'string',
        },
        __typename: 'UiFormInputComponent',
        label: 'Apt., Suite, or Building #',
        placeholder: 'Optional',
        type: 'TEXT',
      },
      {
        ref: '#/properties/address/properties/city',
        schema: {
          required: true,
          type: 'string',
        },
        __typename: 'UiFormInputComponent',
        label: 'City',
        placeholder: 'City',
        type: 'TEXT',
      },
      {
        ref: '#/properties/address/properties/state',
        schema: {
          required: true,
          type: 'string' // ideally an enum but make it easier for now,
        },
        __typename: 'UiDropdownSelectComponent',
        label: 'State',
        options: [
          {
            title: 'Alabama',
            subtitle: null,
            value: 'AL',
            __typename: 'UiFormDataComponentOptions',
          },
          {
            title: 'Alaska',
            subtitle: null,
            value: 'AK',
            __typename: 'UiFormDataComponentOptions',
          },
          {
            title: 'American Samoa',
            subtitle: null,
            value: 'AS',
            __typename: 'UiFormDataComponentOptions',
          },
          {
            title: 'Arizona',
            subtitle: null,
            value: 'AZ',
            __typename: 'UiFormDataComponentOptions',
          },
          {
            title: 'Arkansas',
            subtitle: null,
            value: 'AR',
            __typename: 'UiFormDataComponentOptions',
          },
          {
            title: 'California',
            subtitle: null,
            value: 'CA',
            __typename: 'UiFormDataComponentOptions',
          },
          {
            title: 'Colorado',
            subtitle: null,
            value: 'CO',
            __typename: 'UiFormDataComponentOptions',
          },
          {
            title: 'Connecticut',
            subtitle: null,
            value: 'CT',
            __typename: 'UiFormDataComponentOptions',
          },
          {
            title: 'Delaware',
            subtitle: null,
            value: 'DE',
            __typename: 'UiFormDataComponentOptions',
          },
          {
            title: 'District Of Columbia',
            subtitle: null,
            value: 'DC',
            __typename: 'UiFormDataComponentOptions',
          },
          {
            title: 'Florida',
            subtitle: null,
            value: 'FL',
            __typename: 'UiFormDataComponentOptions',
          },
          {
            title: 'Georgia',
            subtitle: null,
            value: 'GA',
            __typename: 'UiFormDataComponentOptions',
          },
          {
            title: 'Guam',
            subtitle: null,
            value: 'GU',
            __typename: 'UiFormDataComponentOptions',
          },
          {
            title: 'Hawaii',
            subtitle: null,
            value: 'HI',
            __typename: 'UiFormDataComponentOptions',
          },
          {
            title: 'Idaho',
            subtitle: null,
            value: 'ID',
            __typename: 'UiFormDataComponentOptions',
          },
          {
            title: 'Illinois',
            subtitle: null,
            value: 'IL',
            __typename: 'UiFormDataComponentOptions',
          },
          {
            title: 'Indiana',
            subtitle: null,
            value: 'IN',
            __typename: 'UiFormDataComponentOptions',
          },
          {
            title: 'Iowa',
            subtitle: null,
            value: 'IA',
            __typename: 'UiFormDataComponentOptions',
          },
          {
            title: 'Kansas',
            subtitle: null,
            value: 'KS',
            __typename: 'UiFormDataComponentOptions',
          },
          {
            title: 'Kentucky',
            subtitle: null,
            value: 'KY',
            __typename: 'UiFormDataComponentOptions',
          },
          {
            title: 'Louisiana',
            subtitle: null,
            value: 'LA',
            __typename: 'UiFormDataComponentOptions',
          },
          {
            title: 'Maine',
            subtitle: null,
            value: 'ME',
            __typename: 'UiFormDataComponentOptions',
          },
          {
            title: 'Maryland',
            subtitle: null,
            value: 'MD',
            __typename: 'UiFormDataComponentOptions',
          },
          {
            title: 'Massachusetts',
            subtitle: null,
            value: 'MA',
            __typename: 'UiFormDataComponentOptions',
          },
          {
            title: 'Michigan',
            subtitle: null,
            value: 'MI',
            __typename: 'UiFormDataComponentOptions',
          },
          {
            title: 'Minnesota',
            subtitle: null,
            value: 'MN',
            __typename: 'UiFormDataComponentOptions',
          },
          {
            title: 'Mississippi',
            subtitle: null,
            value: 'MS',
            __typename: 'UiFormDataComponentOptions',
          },
          {
            title: 'Missouri',
            subtitle: null,
            value: 'MO',
            __typename: 'UiFormDataComponentOptions',
          },
          {
            title: 'Montana',
            subtitle: null,
            value: 'MT',
            __typename: 'UiFormDataComponentOptions',
          },
          {
            title: 'Nebraska',
            subtitle: null,
            value: 'NE',
            __typename: 'UiFormDataComponentOptions',
          },
          {
            title: 'Nevada',
            subtitle: null,
            value: 'NV',
            __typename: 'UiFormDataComponentOptions',
          },
          {
            title: 'New Hampshire',
            subtitle: null,
            value: 'NH',
            __typename: 'UiFormDataComponentOptions',
          },
          {
            title: 'New Jersey',
            subtitle: null,
            value: 'NJ',
            __typename: 'UiFormDataComponentOptions',
          },
          {
            title: 'New Mexico',
            subtitle: null,
            value: 'NM',
            __typename: 'UiFormDataComponentOptions',
          },
          {
            title: 'New York',
            subtitle: null,
            value: 'NY',
            __typename: 'UiFormDataComponentOptions',
          },
          {
            title: 'North Carolina',
            subtitle: null,
            value: 'NC',
            __typename: 'UiFormDataComponentOptions',
          },
          {
            title: 'North Dakota',
            subtitle: null,
            value: 'ND',
            __typename: 'UiFormDataComponentOptions',
          },
          {
            title: 'Ohio',
            subtitle: null,
            value: 'OH',
            __typename: 'UiFormDataComponentOptions',
          },
          {
            title: 'Oklahoma',
            subtitle: null,
            value: 'OK',
            __typename: 'UiFormDataComponentOptions',
          },
          {
            title: 'Oregon',
            subtitle: null,
            value: 'OR',
            __typename: 'UiFormDataComponentOptions',
          },
          {
            title: 'Pennsylvania',
            subtitle: null,
            value: 'PA',
            __typename: 'UiFormDataComponentOptions',
          },
          {
            title: 'Puerto Rico',
            subtitle: null,
            value: 'PR',
            __typename: 'UiFormDataComponentOptions',
          },
          {
            title: 'Rhode Island',
            subtitle: null,
            value: 'RI',
            __typename: 'UiFormDataComponentOptions',
          },
          {
            title: 'South Carolina',
            subtitle: null,
            value: 'SC',
            __typename: 'UiFormDataComponentOptions',
          },
          {
            title: 'South Dakota',
            subtitle: null,
            value: 'SD',
            __typename: 'UiFormDataComponentOptions',
          },
          {
            title: 'Tennessee',
            subtitle: null,
            value: 'TN',
            __typename: 'UiFormDataComponentOptions',
          },
          {
            title: 'Texas',
            subtitle: null,
            value: 'TX',
            __typename: 'UiFormDataComponentOptions',
          },
          {
            title: 'Utah',
            subtitle: null,
            value: 'UT',
            __typename: 'UiFormDataComponentOptions',
          },
          {
            title: 'Vermont',
            subtitle: null,
            value: 'VT',
            __typename: 'UiFormDataComponentOptions',
          },
          {
            title: 'Virginia',
            subtitle: null,
            value: 'VA',
            __typename: 'UiFormDataComponentOptions',
          },
          {
            title: 'Virgin Islands',
            subtitle: null,
            value: 'VI',
            __typename: 'UiFormDataComponentOptions',
          },
          {
            title: 'Washington',
            subtitle: null,
            value: 'WA',
            __typename: 'UiFormDataComponentOptions',
          },
          {
            title: 'West Virginia',
            subtitle: null,
            value: 'WV',
            __typename: 'UiFormDataComponentOptions',
          },
          {
            title: 'Wisconsin',
            subtitle: null,
            value: 'WI',
            __typename: 'UiFormDataComponentOptions',
          },
          {
            title: 'Wyoming',
            subtitle: null,
            value: 'WY',
            __typename: 'UiFormDataComponentOptions',
          },
        ],
        placeholder: 'State',
      },
      {
        ref: '#/properties/address/properties/zipCode',
        schema: {
          required: true,
          type: 'string',
          pattern: "[0-9]{5}(-[0-9]{4})?", // Would be a cool exercise to change this depending on the country (can try U.S. and Canada)
        },
        __typename: 'UiFormInputComponent',
        label: 'Zip Code',
        placeholder: 'Zip Code',
        type: 'TEXT',
      },
    ],
    rule: null,
  },],
};
