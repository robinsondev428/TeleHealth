import React from "react"

import { Formik, Form } from "formik"
import Button from "@material-ui/core/Button"
import TextField from "@material-ui/core/TextField"
import Autocomplete from "@material-ui/lab/Autocomplete"
import MenuItem from "@material-ui/core/MenuItem"
import PhoneInput from "react-phone-input-2"
import Recaptcha from "react-recaptcha"
import { map, lowerCase } from "lodash"

import specializations from "../../data/specializations"
import allLanguages from "../../data/languages"
import countries from "../../data/countries"

// ISO 3166-1 alpha-2
// ⚠️ No support for IE 11
const countryToFlag = (isoCode: string) => {
  return typeof String.fromCodePoint !== "undefined"
    ? isoCode
        .toUpperCase()
        .replace(/./g, char =>
          String.fromCodePoint(char.charCodeAt(0) + 127397)
        )
    : isoCode
}

const interests = [
  {
    id: "webinar",
    title: "Webinar Consultation",
  },
  {
    id: "group",
    title: "Group Consultation",
  },
  {
    id: "one-to-one",
    title: "One-to-One Consultation",
  },
]

const siteKey = process.env.RECAPTCHA_SITE_KEY

const RegisterForm = ({ validationSchema, initialValues, onSubmit }) => (
  <Formik
    validationSchema={validationSchema}
    initialValues={initialValues}
    enableReinitialize={true}
    onSubmit={onSubmit}
  >
    {({ handleChange, values, errors, touched, setFieldValue }) => (
      <Form>
        <TextField
          fullWidth
          className="textfield"
          id="name"
          name="name"
          label="Full Name"
          autoComplete="new-password"
          variant="filled"
          value={values.name}
          onChange={handleChange}
          error={touched.name && Boolean(errors.name)}
          helperText={touched.name && errors.name}
        />
        <TextField
          fullWidth
          className="textfield"
          autoComplete="new-password"
          id="email"
          name="email"
          label="Email"
          variant="filled"
          value={values.email}
          onChange={handleChange}
          error={touched.email && Boolean(errors.email)}
          helperText={touched.email && errors.email}
        />
        <div className="MuiFormControl-root MuiTextField-root textfield MuiFormControl-fullWidth">
          <PhoneInput
            country={lowerCase(values.country.code)}
            value={values.phoneNumber}
            onChange={phone => {
              setFieldValue("phoneNumber", `+${phone}`)
            }}
          />
        </div>
        <Autocomplete
          id="country-select"
          options={countries}
          autoHighlight
          className="textfield"
          getOptionLabel={option => option.label}
          renderOption={option => (
            <React.Fragment>
              <span>{countryToFlag(option.code)}</span>
              {option.label}
            </React.Fragment>
          )}
          value={values.country}
          onChange={(e, value) => {
            setFieldValue(
              "country",
              value !== null ? value.code : initialValues.country
            )
          }}
          renderInput={params => (
            <TextField
              {...params}
              fullWidth
              label="Choose country you live in"
              variant="filled"
              autoComplete="off"
              inputProps={{
                ...params.inputProps,
              }}
              error={touched.country && Boolean(errors.country)}
              helperText={touched.country && errors.country}
            />
          )}
        />
        <TextField
          fullWidth
          className="textfield"
          name="specialization"
          id="specialization"
          variant="filled"
          autoComplete="new-password"
          select
          label="Choose your specialization"
          value={values.specialization}
          onChange={handleChange}
          error={touched.specialization && Boolean(errors.specialization)}
          helperText={touched.specialization && errors.specialization}
        >
          {specializations.map(option => (
            <MenuItem key={option.id} value={option.id}>
              {option.name}
            </MenuItem>
          ))}
        </TextField>
        <Autocomplete
          multiple
          id="languages"
          options={allLanguages}
          getOptionLabel={option => option.name}
          defaultValue={[]}
          onChange={(e, value) => {
            const languages = map(value, option => {
              return option.id
            })
            setFieldValue(
              "languages",
              value !== null ? languages : initialValues.languages
            )
          }}
          renderInput={params => (
            <TextField
              {...params}
              variant="filled"
              autoComplete="new-password"
              label="Known languages"
              className="textfield"
              placeholder="Choose"
              helperText={touched.languages && errors.languages}
            />
          )}
        />
        <Autocomplete
          multiple
          id="preferred-consultation"
          options={interests}
          getOptionLabel={option => option.title}
          defaultValue={[]}
          onChange={(e, value) => {
            const preferredConsultation = value || []

            setFieldValue(
              "preferredConsultation",
              value !== null
                ? preferredConsultation.map(consultation => consultation.id)
                : initialValues.preferredConsultation
            )
          }}
          renderInput={params => (
            <TextField
              {...params}
              variant="filled"
              className="textfield"
              label="Preferred consultation"
              placeholder="Choose"
            />
          )}
        />
        <Recaptcha
          sitekey={siteKey}
          render="explicit"
          verifyCallback={(response: any) => {
            setFieldValue("recaptcha", response)
          }}
          onloadCallback={() => {
            console.log("done loading!")
          }}
        />
        <Button
          size="large"
          className="submit"
          color="primary"
          variant="contained"
          fullWidth
          type="submit"
        >
          Submit
        </Button>
      </Form>
    )}
  </Formik>
)

export default RegisterForm
