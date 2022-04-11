//todo: validator for fens and move (from AddFens)

//sync fen's board with fen's FormInput field

import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { editLocationState } from "../../types";
import Chessground from "@react-chess/chessground";

import ProForm, {
  ModalForm,
  ProFormText,
  ProFormTextArea,
} from "@ant-design/pro-form";
import { Card, Row, Col, Button, message, Popconfirm } from "antd";

const boardWidth = 150;

const EditFens = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id, password } = location.state as editLocationState; // Type Casting, then you can get the params passed via router
  const [fens, setFens] = useState<any>([]);
  const [index, setIndex] = useState<any>();
  console.log(id, password);

  //fetching initial fens
  useEffect(() => {
    const fetch = async () => {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      try {
        const { data } = await axios.get(`/api/fens/${id}`, config);
        setFens(data.data.fens);
      } catch (error) {
        console.log(error);
      }
    };

    fetch();
  }, []);

  //on delete
  const onDeleteFen = (index: number) => {
    const deleteFen = async () => {
      console.log("ciao");
      try {
        await axios
          .put(`/api/fens/${id}`, { index: index, private: password })
          .then((res) => {
            setFens(() => {
              return fens.splice(index, 1);
            });
            console.log("success!");
          });
      } catch (error) {
        console.log(error);
        //todo: add error handling for when there is a problem like SetError
      }
    };

    deleteFen();
  };

  //on edit modal
  const onEditFen = (values: any) => {
    console.log(values);
    const editFen = async () => {
      try {
        await axios
          .put(`/api/fens/edit/${id}`, {
            private: password,
            san: values.san,
            fen: values.fen,
            description: values.description,
            index: index,
          })
          .then((res) => {
            setFens(res.data.data);
          });
      } catch (error) {
        console.log(error);
      }
    };

    editFen();
  };

  //on add modal
  const onAddFen = (values: any) => {
    console.log(values);
    const editFen = async () => {
      try {
        await axios
          .put(`/api/fens/edit/fen/${id}`, {
            private: password,
            san: values.san,
            fen: values.fen,
            description: values.description,
          })
          .then((res) => {
            setFens(res.data.data);
          });
      } catch (error) {
        console.log(error);
      }
    };

    editFen();
  };

  //on submit
  const onSubmitStudy = () => {
    navigate(`/study/${id}`);
  };
  //ondiscard
  const onDiscardStudy = () => {
    console.log("helo");
    const deleteStudy = async () => {
      try {
        await axios
          .put(`/api/fens/delete/${id}`, {
            private: password,
          })
          .then((res) => {
            navigate("/play");
          });
      } catch (error) {
        console.log(error);
      }
    };

    deleteStudy();
  };

  /* if (fens.length === 0) return <h1>Loading...</h1>; */
  return (
    <>
      <h1>Review your study</h1>
      <ModalForm<{
        name: string;
        company: string;
      }>
        title="Add Position"
        trigger={<Button type="primary">Add Position</Button>}
        autoFocusFirstInput
        modalProps={{
          onCancel: () => console.log("run"),
        }}
        onFinish={async (values) => {
          onAddFen(values);
          console.log(values.name);
          message.success("提交成功");
          return true;
        }}
      >
        <ProForm.Group>
          <ProFormText
            width="md"
            name="fen"
            label="Fen's Position"
            tooltip="最长为 24 位"
            placeholder="fen"
            initialValue={
              "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
            }
          />
        </ProForm.Group>
        <ProForm.Group>
          <ProFormTextArea
            width="xl"
            name="description"
            label="Description"
            tooltip="最长为 24 位"
            placeholder="Description"
          />
          <Chessground
            width={400}
            height={400}
            config={{ coordinates: false }}
          />
        </ProForm.Group>
        <ProForm.Group>
          <ProFormText
            width="md"
            name="san"
            label="Correct Move"
            tooltip="最长为 24 位"
            placeholder="san"
          />
        </ProForm.Group>
      </ModalForm>
      <Row gutter={[24, 24]}>
        {fens?.map(
          (
            fen: {
              _id: string;
              fen: string;
              description: string;
              san: string;
            },
            index: number
          ) => (
            <Col xs={24} sm={12} lg={6} className="fen-card" key={fen._id}>
              <Card>
                <p>
                  <Chessground
                    height={boardWidth}
                    width={boardWidth}
                    config={{ fen: fen?.fen, coordinates: false }}
                  />
                </p>
                <p>
                  <strong>Description:</strong>
                  {fen.description}
                </p>
                <p>
                  <strong>Correct move:</strong>
                  {fen.san}
                </p>
                <Button onClick={() => onDeleteFen(index)}>Delete</Button>
                {/* edit modal */}
                <ModalForm<{
                  name: string;
                  company: string;
                }>
                  title="Edit Position"
                  trigger={
                    <Button type="primary" onClick={() => setIndex(index)}>
                      Edit
                    </Button>
                  }
                  autoFocusFirstInput
                  modalProps={{
                    onCancel: () => console.log("run"),
                  }}
                  onFinish={async (values) => {
                    onEditFen(values);
                    console.log(values.name);
                    message.success("提交成功");
                    return true;
                  }}
                >
                  <ProForm.Group>
                    <ProFormText
                      width="md"
                      name="fen"
                      label="Fen's Position"
                      tooltip="最长为 24 位"
                      placeholder="fen"
                      initialValue={fen.fen}
                    />
                  </ProForm.Group>
                  <ProForm.Group>
                    <ProFormTextArea
                      width="xl"
                      name="description"
                      label="Description"
                      tooltip="最长为 24 位"
                      placeholder="Description"
                      initialValue={fen.description}
                    />
                    <Chessground
                      width={400}
                      height={400}
                      config={{ coordinates: false }}
                    />
                  </ProForm.Group>
                  <ProForm.Group>
                    <ProFormText
                      width="md"
                      name="san"
                      label="Correct Move"
                      tooltip="最长为 24 位"
                      placeholder="san"
                      initialValue={fen.san}
                    />
                  </ProForm.Group>
                </ModalForm>
              </Card>
            </Col>
          )
        )}
      </Row>

      <Popconfirm
        title="Are you sure you want to submit this study?"
        onConfirm={onSubmitStudy}
      >
        <Button type="primary">Submit Study</Button>
      </Popconfirm>

      <Popconfirm
        title="Are you sure you want to discard all the changes?"
        onConfirm={() => onDiscardStudy()}
      >
        <Button danger>Discard Changes</Button>
      </Popconfirm>
    </>
  );
};

export default EditFens;
