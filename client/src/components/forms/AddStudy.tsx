import React, { useState } from "react";
import { Form, Button, Checkbox, DatePicker, Input, Select, Space } from "antd";
import { useNavigate } from "react-router-dom";

const AddStudy = () => {
  const navigate = useNavigate();
  const [hidden, setHidden] = useState(true);
  const [required, setRequired] = useState(false);

  const onPrivate = () => {
    setHidden((prev) => !prev);
    setRequired((prev) => !prev);
  };
  const onFinish = (values: any) => {
    navigate("fens", { state: values });
  };
  return (
    <Form
      autoComplete="off"
      labelCol={{ span: 10 }}
      wrapperCol={{ span: 14 }}
      onFinish={onFinish}
      onFinishFailed={(error) => {
        console.log({ error });
        console.log(error);
      }}
    >
      <Form.Item
        name="collectionName"
        label="Study Name"
        rules={[
          {
            required: true,
            message: "Please enter the Study Name",
          },
          { whitespace: true },
          { min: 4 },
        ]}
        hasFeedback
      >
        <Input placeholder="Type the Study Name" />
      </Form.Item>
      <Form.Item
        name="by"
        label="Author"
        rules={[
          {
            required: false,
            message: "Please the Author Name",
          },
          { whitespace: true },
          { min: 4 },
        ]}
        hasFeedback
      >
        <Input placeholder="Type your name" />
      </Form.Item>
      <Checkbox onChange={onPrivate}>Private Study</Checkbox>
      (Tip: To change or delete this study make it private.)
      <Form.Item
        name="password"
        label="Password"
        hidden={hidden}
        rules={[
          {
            required: required,
          },
          { min: 6 },
          {
            validator: (_, value) =>
              value || !required
                ? Promise.resolve()
                : Promise.reject("Password does not match criteria."),
          },
        ]}
        hasFeedback
      >
        <Input.Password placeholder="Type your password" />
      </Form.Item>
      <Form.Item
        name="confirmPassword"
        label="Confirm Password"
        hidden={hidden}
        dependencies={["password"]}
        rules={[
          {
            required: required,
          },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue("password") === value) {
                return Promise.resolve();
              }
              return Promise.reject(
                "The two passwords that you entered does not match."
              );
            },
          }),
        ]}
        hasFeedback
      >
        <Input.Password placeholder="Confirm your password" />
      </Form.Item>
      {/* <Form.Item
        name="agreement"
        wrapperCol={{ span: 24 }}
        valuePropName="checked"
        rules={[
          {
            validator: (_, value) =>
              value
                ? Promise.resolve()
                : Promise.reject(
                    "To proceed, you need to agree with our terms and conditions"
                  ),
          },
        ]}
      >
        <Checkbox>
          {" "}
          Agree to our <a href="#">Terms and Conditions</a>
        </Checkbox>
      </Form.Item> */}
      <Form.Item wrapperCol={{ span: 24 }}>
        <Button block type="primary" htmlType="submit">
          Submit Study
        </Button>
      </Form.Item>
    </Form>
  );
};

export default AddStudy;
function state(arg0: string, state: any, values: any) {
  throw new Error("Function not implemented.");
}
