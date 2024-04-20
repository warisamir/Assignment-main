import React, { useState, useCallback } from "react";
import ReactFlow, {
  Controls,
  Background,
  addEdge,
  useNodesState,
  useEdgesState,
  ConnectionLineType,
} from "react-flow-renderer";
import { nodes as initialNodes, edges as initialEdges } from "./element";
import { Button, Modal, Input, Form } from "antd";

function Flow() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedNode, setSelectedNode] = useState(null);

  const onConnect = useCallback(
    (params) =>
      setEdges((eds) =>
        addEdge(
          {
            ...params,
            type: ConnectionLineType.SmoothStep,
            animated: true,
            // style: { stroke: "red" },
          },
          eds
        )
      ),
    [setEdges]
  );

  const getNodeId = () => Math.random();

  function onInit() {
    console.log("Logged");
  }

  function displayCustomNamedNodeModal() {
    setIsModalVisible(true);
  }

  function handleCancel() {
    setIsModalVisible(false);
  }

  function handleOk(data) {
    if (selectedNode) {
      onUpdate(selectedNode.id, data.nodeName);
      setSelectedNode(null);
    } else {
      onAdd(data.nodeName);
    }
    setIsModalVisible(false);
  }

  const onAdd = useCallback(
    (nodeName) => {
      const newNode = {
        id: String(getNodeId()),
        data: { label: nodeName },
        position: {
          x: 50,
          y: 0,
        },
      };
      setNodes((nds) => nds.concat(newNode));
    },
    [setNodes]
  );

  const onUpdate = useCallback(
    (nodeId, nodeName) => {
      setNodes((nds) =>
        nds.map((node) =>
          node.id === nodeId ? { ...node, data: { label: nodeName } } : node
        )
      );
    },
    [setNodes]
  );

  const handleUpdateClick = useCallback(() => {
    if (selectedNode) {
      displayCustomNamedNodeModal();
    }
  }, [selectedNode, displayCustomNamedNodeModal]);

  return (
    <div style={{ height: "100%", width: "100%" }}>
      <h1 style={{ textAlign: "center" }}>Interactly react flow</h1>
      <Modal
        title={selectedNode ? "Update node" : "Create a new node"}
        visible={isModalVisible}
        onCancel={handleCancel}
      >
        <Form onFinish={handleOk} autoComplete="off" name="new node">
          <Form.Item label="Node Name" name="nodeName" initialValue={selectedNode ? selectedNode.data.label : ""}>
            <Input />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              {selectedNode ? "Update" : "Submit"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      <Button type="primary" onClick={() => displayCustomNamedNodeModal()}>
        {selectedNode ? "Update node" : "Create node"}
      </Button>

      <Button
        type="primary"
        onClick={handleUpdateClick}
        style={{ marginLeft: 10 }}
      >
        Update
      </Button>

      <div style={{ height: "500px", margin: "10px", border: "2px solid red" }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onInit={onInit}
          fitView
          attributionPosition="bottom-left"
          connectionLineType={ConnectionLineType.SmoothStep}
          onNodeSelection={(node) => setSelectedNode(node)}
        >
          <Background />
          <Controls />
        </ReactFlow>
      </div>
    </div>
  );
}

export default Flow;
