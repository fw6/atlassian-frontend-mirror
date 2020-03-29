import React, { ReactNode } from 'react';
import { mount, ReactWrapper } from 'enzyme';
import { render, fireEvent, act } from '@testing-library/react';
import Button from '@atlaskit/button';
import Select, { ValueType } from '@atlaskit/select';
import TextField from '@atlaskit/textfield';

import Form, { Field, HelperMessage, ErrorMessage, ValidMessage } from '../..';
import { Label } from '../../styled/Field';

type Props<T> = {
  defaultState: T;
  children: (value: T, setValue: (value: T) => void) => ReactNode;
};

type State<T> = {
  currentState: T;
};

export class WithState<T> extends React.Component<Props<T>, State<T>> {
  state = {
    currentState: this.props.defaultState,
  };

  render() {
    return this.props.children(this.state.currentState, state =>
      this.setState({ currentState: state }),
    );
  }
}

const touch = (wrapper: ReactWrapper<any>) => {
  wrapper.simulate('focus');
  wrapper.simulate('blur');
};

test('should not be dirty after mount', () => {
  const wrapper = mount(
    <Form onSubmit={jest.fn()}>
      {() => (
        <Field name="username" defaultValue="Joe Bloggs">
          {({ fieldProps, meta: { dirty } }) => (
            <>
              <TextField {...fieldProps} />
              <HelperMessage>
                Field is {dirty === true ? 'dirty' : 'pristine'}
              </HelperMessage>
            </>
          )}
        </Field>
      )}
    </Form>,
  );
  expect(wrapper.find(HelperMessage).text()).toBe('Field is pristine');
});

test('defaultValue should be correctly set by final-form', () => {
  const spy = jest.fn();
  const wrapper = mount(
    <Form onSubmit={spy}>
      {({ formProps }) => (
        <form {...formProps}>
          <Field name="username" defaultValue="Joe Bloggs">
            {({ fieldProps }) => <TextField {...fieldProps} />}
          </Field>
          <Button type="submit">Submit</Button>
        </form>
      )}
    </Form>,
  );

  wrapper.find(Button).simulate('submit');

  expect(spy).toHaveBeenCalledWith(
    expect.objectContaining({ username: 'Joe Bloggs' }),
    expect.any(Object),
    expect.any(Function),
  );
});

test('untouched field should not show validation error', () => {
  const wrapper = mount(
    <Form onSubmit={jest.fn()}>
      {() => (
        <Field
          name="username"
          defaultValue="Joe Bloggs"
          validate={() => 'ERROR'}
        >
          {({ fieldProps, error }) => (
            <>
              <TextField {...fieldProps} />
              {error && (
                <ErrorMessage>There is a problem with this field</ErrorMessage>
              )}
            </>
          )}
        </Field>
      )}
    </Form>,
  );
  expect(wrapper.find(ErrorMessage)).toHaveLength(0);
  expect(wrapper.find(TextField).props()).toMatchObject({ isInvalid: false });
});

test('touched field should show validation error', () => {
  const wrapper = mount(
    <Form onSubmit={jest.fn()}>
      {() => (
        <Field
          name="username"
          defaultValue="Joe Bloggs"
          validate={() => 'ERROR'}
        >
          {({ fieldProps, error }) => (
            <>
              <TextField {...fieldProps} />
              {error && (
                <ErrorMessage>There is a problem with this field</ErrorMessage>
              )}
            </>
          )}
        </Field>
      )}
    </Form>,
  );

  touch(wrapper.find('input'));

  expect(wrapper.find(ErrorMessage)).toHaveLength(1);
  expect(wrapper.find(TextField).props()).toMatchObject({ isInvalid: true });
});

test('should show errors after submission', () => {
  const wrapper = mount(
    <Form onSubmit={() => Promise.resolve({ username: 'TAKEN_USERNAME' })}>
      {({ formProps }) => (
        <form {...formProps}>
          <Field name="username" defaultValue="Joe Bloggs">
            {({ fieldProps, error }) => (
              <>
                <TextField {...fieldProps} />
                {error === 'TAKEN_USERNAME' && (
                  <ErrorMessage>
                    There is a problem with this field
                  </ErrorMessage>
                )}
              </>
            )}
          </Field>
          <Button type="submit">Submit</Button>
        </form>
      )}
    </Form>,
  );
  expect(wrapper.find(ErrorMessage)).toHaveLength(0);
  wrapper.find(Button).simulate('submit');
  return Promise.resolve().then(() => {
    wrapper.update();
    expect(wrapper.find(ErrorMessage)).toHaveLength(1);
    expect(wrapper.find(TextField).props()).toMatchObject({ isInvalid: true });
  });
});

test('change in defaultValue should reset form field', () => {
  const wrapper = mount(
    <WithState defaultState="">
      {(defaultValue, setDefaultValue) => (
        <>
          <Form onSubmit={jest.fn()}>
            {() => (
              <Field
                name="username"
                defaultValue={defaultValue}
                validate={(value = '') =>
                  value.length < 1 ? 'too short' : undefined
                }
              >
                {({ fieldProps, error }) => (
                  <>
                    <TextField {...fieldProps} />
                    {error && (
                      <ErrorMessage>
                        There is a problem with this field
                      </ErrorMessage>
                    )}
                  </>
                )}
              </Field>
            )}
          </Form>
          <Button onClick={() => setDefaultValue('jill')}>Submit</Button>
        </>
      )}
    </WithState>,
  );

  wrapper.find(Button).simulate('click');

  return Promise.resolve().then(() => {
    wrapper.update();
    expect(wrapper.find(ErrorMessage)).toHaveLength(0);
    expect(wrapper.find(TextField).props()).toMatchObject({ value: 'jill' });
  });
});

test('object identity change in defaultValue should not reset form field', async () => {
  const wrapper = mount(
    <WithState defaultState={{ value: { deep: 'value' } }}>
      {(defaultValue, setDefaultValue) => (
        <>
          <Form onSubmit={jest.fn()}>
            {() => (
              <Field<{ value: { deep: string } }>
                name="username"
                defaultValue={defaultValue}
              >
                {({
                  fieldProps: { value, onChange, ...otherFieldProps },
                  error,
                }) => (
                  <>
                    <TextField
                      value={value.value.deep}
                      onChange={(event: React.FormEvent<HTMLInputElement>) => {
                        onChange({
                          value: { deep: event.currentTarget.value },
                        });
                      }}
                      {...otherFieldProps}
                    />
                    {error && (
                      <ErrorMessage>
                        There is a problem with this field
                      </ErrorMessage>
                    )}
                  </>
                )}
              </Field>
            )}
          </Form>
          <Button onClick={() => setDefaultValue({ value: { deep: 'value' } })}>
            Submit
          </Button>
        </>
      )}
    </WithState>,
  );

  // Start with the defaultValue
  expect(wrapper.find(TextField).props()).toMatchObject({ value: 'value' });

  // Update the value to something else
  wrapper.find(TextField).prop('onChange')!({
    currentTarget: { value: 'newValue' },
  } as React.FormEvent<HTMLInputElement>);
  await Promise.resolve();
  wrapper.update();
  expect(wrapper.find(TextField).props()).toMatchObject({ value: 'newValue' });

  // Reset the default value to the same value (but with a different object identity)
  wrapper.find(Button).simulate('click');
  await Promise.resolve();
  wrapper.update();

  // Ensure the value did not reset to the default value
  expect(wrapper.find(TextField).props()).toMatchObject({ value: 'newValue' });
});

test('array element identity change in defaultValue should not reset form field', async () => {
  const wrapper = mount(
    <WithState defaultState={[{ val: 'first' }, { val: 'second' }]}>
      {(defaultValue, setDefaultValue) => (
        <>
          <Form onSubmit={jest.fn()}>
            {() => (
              <Field<{ val: string }[]>
                name="username"
                defaultValue={defaultValue}
              >
                {({
                  fieldProps: { value, onChange, ...otherFieldProps },
                  error,
                }) => (
                  <>
                    <TextField
                      value={JSON.stringify(value)}
                      onChange={(event: React.FormEvent<HTMLInputElement>) => {
                        onChange([
                          ...value,
                          { val: event.currentTarget.value },
                        ]);
                      }}
                      {...otherFieldProps}
                    />
                    {error && (
                      <ErrorMessage>
                        There is a problem with this field
                      </ErrorMessage>
                    )}
                  </>
                )}
              </Field>
            )}
          </Form>
          <Button
            onClick={() =>
              setDefaultValue([{ val: 'first' }, { val: 'second' }])
            }
          >
            Submit
          </Button>
        </>
      )}
    </WithState>,
  );

  // Start with the defaultValue
  expect(wrapper.find(TextField).props()).toMatchObject({
    value: JSON.stringify([{ val: 'first' }, { val: 'second' }]),
  });

  // Update the value to something else
  wrapper.find(TextField).prop('onChange')!({
    currentTarget: { value: 'third' },
  } as React.FormEvent<HTMLInputElement>);
  await Promise.resolve();
  wrapper.update();
  expect(wrapper.find(TextField).props()).toMatchObject({
    value: JSON.stringify([
      { val: 'first' },
      { val: 'second' },
      { val: 'third' },
    ]),
  });

  // Reset the default value to the same value (but with different element identities)
  wrapper.find(Button).simulate('click');
  await Promise.resolve();
  wrapper.update();

  // Ensure the value did not reset to the default value
  expect(wrapper.find(TextField).props()).toMatchObject({
    value: JSON.stringify([
      { val: 'first' },
      { val: 'second' },
      { val: 'third' },
    ]),
  });
});

test('change in name should reset form field', () => {
  const submitFn = jest.fn();
  const { getByTestId } = render(
    <WithState defaultState="name">
      {(name, setName) => (
        <Form onSubmit={submitFn}>
          {({ formProps }) => (
            <form {...formProps}>
              <Field name={name} defaultValue="unchanged">
                {({ fieldProps }) => (
                  <TextField {...fieldProps} testId="TextField" />
                )}
              </Field>
              <Button
                testId="UpdateTrigger"
                onClick={() => setName('username')}
              >
                Change
              </Button>
              <Button testId="Submit" type="submit">
                Submit
              </Button>
            </form>
          )}
        </Form>
      )}
    </WithState>,
  );

  (getByTestId('TextField') as HTMLInputElement).value = 'changed_input';
  fireEvent.click(getByTestId('UpdateTrigger'));
  fireEvent.click(getByTestId('Submit'));

  expect(submitFn).toHaveBeenCalledWith(
    expect.objectContaining({ username: 'unchanged' }),
    expect.any(Object),
    expect.any(Function),
  );
});

test('select reset should work', async () => {
  type OptionType = { label: string; value: string };
  const submitFn = jest.fn();
  const wrapper = render(
    <Form onSubmit={submitFn}>
      {({ formProps }) => (
        <form {...formProps}>
          <Field<ValueType<OptionType>>
            name="select"
            defaultValue={{ label: 'a default value', value: '1' }}
          >
            {({ fieldProps }) => (
              <Select
                {...fieldProps}
                placeholder="select a value"
                isClearable
                testId="selecto"
              />
            )}
          </Field>
        </form>
      )}
    </Form>,
  );

  // starts with default value (and not placeholder text)
  expect(wrapper.getByText('a default value').style).toMatchObject({
    opacity: '1',
  });
  expect(wrapper.queryAllByText('select a value')).toHaveLength(0);

  // clear the default value
  const clear = wrapper.getByLabelText('clear');
  act(() => {
    fireEvent.mouseDown(clear, { button: 0 });
  });

  // placeholder text appears after default value has been cleared
  expect(wrapper.getByText('select a value')).toBeTruthy();
  expect(wrapper.getByText('a default value').style).toMatchObject({
    opacity: '0',
  });
});

test('should associate messages with field', () => {
  const wrapper = mount(
    <Form onSubmit={jest.fn()}>
      {() => (
        <Field name="username" id="username" defaultValue="">
          {({ fieldProps }) => (
            <>
              <TextField {...fieldProps} />
              <HelperMessage>Helper text</HelperMessage>
              <ErrorMessage>Error message</ErrorMessage>
              <ValidMessage>Valid message</ValidMessage>
            </>
          )}
        </Field>
      )}
    </Form>,
  );
  const labelledBy = wrapper
    .find(TextField)
    .prop('aria-labelledby')
    .split(' ');
  expect(labelledBy).toContain(
    wrapper
      .find(HelperMessage)
      .find('div')
      .prop('id'),
  );
  expect(labelledBy).toContain(
    wrapper
      .find(ErrorMessage)
      .find('div')
      .prop('id'),
  );
  expect(labelledBy).toContain(
    wrapper
      .find(ValidMessage)
      .find('div')
      .prop('id'),
  );
});

test('should associate label with field', () => {
  const wrapper = mount<typeof Form>(
    <Form onSubmit={jest.fn()}>
      {() => (
        <Field name="username" id="username" label="User name" defaultValue="">
          {({ fieldProps }) => <TextField {...fieldProps} />}
        </Field>
      )}
    </Form>,
  );
  const labelledBy = wrapper
    .find(TextField)
    .prop('aria-labelledby')
    .split(' ');
  expect(labelledBy).toContain(wrapper.find(Label).prop('id'));
});

test('should indicate whether form is submitting', () => {
  let complete = () => {};
  const promise = new Promise(res => {
    complete = res;
  });
  const wrapper = mount(
    <Form onSubmit={() => promise}>
      {({ formProps, submitting }) => (
        <form {...formProps}>
          <Button type="submit">{submitting ? 'submitting' : 'submit'}</Button>
        </form>
      )}
    </Form>,
  );
  expect(wrapper.find(Button).text()).toBe('submit');
  wrapper.find(Button).simulate('submit');
  return Promise.resolve()
    .then(() => {
      wrapper.setProps({});
      expect(wrapper.find(Button).text()).toBe('submitting');
      complete();
    })
    .then(() => {
      wrapper.setProps({});
      expect(wrapper.find(Button).text()).toBe('submit');
    });
});

test('isDisabled should disable all fields in form', () => {
  const spy = jest.fn();
  const wrapper = mount(
    <Form onSubmit={spy} isDisabled>
      {({ formProps, disabled }) => (
        <form {...formProps}>
          <Field name="name" defaultValue="">
            {({ fieldProps }) => <TextField {...fieldProps} />}
          </Field>
          <Button type="submit" isDisabled={disabled}>
            Submit
          </Button>
        </form>
      )}
    </Form>,
  );
  expect(wrapper.find(TextField).prop('isDisabled')).toBe(true);
  expect(wrapper.find(Button).prop('isDisabled')).toBe(true);
});

test('should never render with undefined fieldProp value', () => {
  const spy = jest.fn(() => 'Hello');

  mount(
    <Form onSubmit={() => {}}>
      {() => (
        <Field name="username" defaultValue="Joe Bloggs">
          {spy}
        </Field>
      )}
    </Form>,
  );

  return Promise.resolve().then(() => {
    expect(spy).toHaveBeenCalledWith(
      expect.objectContaining({
        fieldProps: expect.objectContaining({ value: 'Joe Bloggs' }),
      }),
    );
  });
});

test('should not show submit error if field value has changed since it was submitted if field validation also used', () => {
  const { getByTestId, queryByText } = render(
    <Form onSubmit={() => ({ username: 'TAKEN_USERNAME' })}>
      {({ formProps: { onSubmit } }) => (
        <>
          <Field
            name="username"
            defaultValue="Jane Chan"
            validate={(value = '') =>
              value === 'foo' ? 'TAKEN_USERNAME' : undefined
            }
          >
            {({ fieldProps, error }) => (
              <>
                <TextField {...fieldProps} testId="TextField" />
                {error === 'TAKEN_USERNAME' ? (
                  <ErrorMessage>Username taken</ErrorMessage>
                ) : null}
              </>
            )}
          </Field>
          <Button onClick={onSubmit} testId="SubmitButton">
            Submit
          </Button>
        </>
      )}
    </Form>,
  );

  const errorMessage = 'Username taken';
  const input = getByTestId('TextField');
  const button = getByTestId('SubmitButton');

  expect(queryByText(errorMessage)).toBeNull();

  act(() => {
    fireEvent.click(button);
  });

  expect(queryByText(errorMessage)).toBeTruthy();

  act(() => {
    fireEvent.change(input, { target: { value: 'John Doe' } });
  });

  expect(queryByText(errorMessage)).toBeNull();
});

test('should persist submit error if field value has changed since it was submitted if field validation not used', () => {
  const wrapper = mount(
    <Form onSubmit={() => Promise.resolve({ username: 'TAKEN_USERNAME' })}>
      {({ formProps: { onSubmit } }) => (
        <>
          <Field name="username" defaultValue="Jane Chan">
            {({ fieldProps, error }) => (
              <>
                <TextField {...fieldProps} />
                {error === 'TAKEN_USERNAME' && (
                  <ErrorMessage>
                    There is a problem with this field
                  </ErrorMessage>
                )}
              </>
            )}
          </Field>
          <Button onClick={onSubmit}>Submit</Button>
        </>
      )}
    </Form>,
  );
  expect(wrapper.find(ErrorMessage)).toHaveLength(0);
  wrapper.find(Button).simulate('click');
  return Promise.resolve().then(() => {
    wrapper.update();
    expect(wrapper.find(ErrorMessage)).toHaveLength(1);
    expect(wrapper.find(TextField).prop('isInvalid')).toBe(true);
    wrapper.find('input').simulate('change', { target: { value: 'Jane Cha' } });
    expect(wrapper.find(ErrorMessage)).toHaveLength(1);
    expect(wrapper.find(TextField).prop('isInvalid')).toBe(true);
  });
});

test('should continue to show field validation normally, even after submit has failed', () => {
  const { getByTestId, queryByText } = render(
    <Form onSubmit={() => Promise.resolve({ username: 'TAKEN_USERNAME' })}>
      {({ formProps: { onSubmit } }) => (
        <>
          <Field
            name="username"
            defaultValue=""
            validate={(value = '') => {
              if (value.length < 5) return 'TOO_SHORT';
              if (value === 'Jane Chan') return 'TAKEN_USERNAME';

              return undefined;
            }}
          >
            {({ fieldProps, error }) => (
              <>
                <TextField testId="TextField" {...fieldProps} />
                {error === 'TAKEN_USERNAME' ? (
                  <ErrorMessage>Username taken</ErrorMessage>
                ) : null}
                {error === 'TOO_SHORT' && (
                  <ErrorMessage>Too short</ErrorMessage>
                )}
              </>
            )}
          </Field>
          <Button type="submit" testId="SubmitButton" onClick={onSubmit}>
            Submit
          </Button>
        </>
      )}
    </Form>,
  );

  const input = getByTestId('TextField');
  const button = getByTestId('SubmitButton');

  act(() => {
    fireEvent.click(button);
    fireEvent.change(input, { target: { value: 'Jane Chan' } });
  });

  expect(queryByText('Username taken')).toBeTruthy();
  expect(queryByText('Too short')).toBeNull();

  act(() => {
    fireEvent.change(input, { target: { value: 'Jane' } });
  });

  expect(queryByText('Username taken')).toBeNull();
  expect(queryByText('Too short')).toBeTruthy();

  act(() => {
    fireEvent.change(input, { target: { value: 'John Doe' } });
  });

  expect(queryByText('Username taken')).toBeNull();
  expect(queryByText('Too short')).toBeNull();
});

test('should correctly update the form state with a non-event value', () => {
  const onSubmitMock = jest.fn();

  const { getByTestId } = render(
    <Form onSubmit={onSubmitMock}>
      {({ formProps: { onSubmit } }) => (
        <>
          <Field name="username" defaultValue="">
            {({ fieldProps: { onChange, ...rest } }) => (
              <TextField
                {...rest}
                testId="TextField"
                onChange={(event: React.FormEvent<HTMLInputElement>) =>
                  onChange(event.currentTarget.value)
                }
              />
            )}
          </Field>
          <Button testId="Submit" onClick={onSubmit}>
            Submit
          </Button>
        </>
      )}
    </Form>,
  );

  fireEvent.change(getByTestId('TextField') as HTMLInputElement, {
    target: { value: 'joebloggs123' },
  });

  fireEvent.click(getByTestId('Submit'));

  expect(onSubmitMock).toHaveBeenCalledWith(
    expect.objectContaining({ username: 'joebloggs123' }),
    expect.any(Object),
    expect.any(Function),
  );
});

// unskip as part of https://ecosystem.atlassian.net/browse/AK-5752
// eslint-disable-next-line jest/no-disabled-tests
xtest('should always show most recent validation result', done => {
  let resolveValidation = () => {};
  const wrapper = mount(
    <Form onSubmit={jest.fn()}>
      {() => (
        <Field
          name="username"
          defaultValue=""
          validate={(value = '') => {
            if (value.length < 3) {
              return 'TOO_SHORT';
            }
            if (value === 'Joe Bloggs') {
              return new Promise(res => {
                resolveValidation = () => res('TAKEN_USERNAME');
              });
            }
            return undefined;
          }}
        >
          {({ fieldProps, error }) => (
            <>
              <TextField {...fieldProps} />
              {error === 'TOO_SHORT' && <ErrorMessage>Too short</ErrorMessage>}
              {error === 'TAKEN_USERNAME' && (
                <ErrorMessage>Username is in use</ErrorMessage>
              )}
            </>
          )}
        </Field>
      )}
    </Form>,
  );
  // kick off an async validation that will fail
  wrapper.find('input').simulate('change', { target: { value: 'Joe Bloggs' } });
  // causes a sync validation failure
  wrapper.find('input').simulate('change', { target: { value: 'Jo' } });
  // now resolve previous async validation
  resolveValidation();
  // check that the most recent error message is visible - should be the sync validation error
  setTimeout(() => {
    wrapper.update();
    expect(wrapper.find(ErrorMessage)).toHaveLength(1);
    expect(wrapper.find(ErrorMessage).text()).toBe('Too short');
    done();
  });
});
