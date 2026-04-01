import { useEffect, useState } from "react";
import {
  Avatar, Badge, Button, Form, Input, Modal, Popconfirm,
  Select, Switch, Table, Tag, Typography, message, Space,
} from "antd";
import { DeleteOutlined, EditOutlined, PlusOutlined, UserOutlined } from "@ant-design/icons";
import { AuthUser } from "../store/authSlice";
import { listUsers, createUser, updateUser, deleteUser, CreateUserPayload, UpdateUserPayload } from "../services/userService";

const { Text } = Typography;

export default function UserManagementPage() {
  const [users, setUsers] = useState<AuthUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);
  const [editUser, setEditUser] = useState<AuthUser | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [createForm] = Form.useForm();
  const [editForm] = Form.useForm();

  const fetchUsers = async () => {
    setLoading(true);
    try { setUsers(await listUsers()); }
    catch { message.error("Failed to load users."); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleCreate = async (values: CreateUserPayload) => {
    setSubmitting(true);
    try {
      const newUser = await createUser(values);
      setUsers(prev => [...prev, newUser]);
      message.success(`User ${newUser.email} created.`);
      setCreateOpen(false); createForm.resetFields();
    } catch (err: unknown) {
      const data = (err as { response?: { data?: Record<string, string[]> } })?.response?.data;
      message.error(data?.email?.[0] ?? "Failed to create user.");
    } finally { setSubmitting(false); }
  };

  const handleEdit = async (values: UpdateUserPayload) => {
    if (!editUser) return;
    setSubmitting(true);
    try {
      const updated = await updateUser(editUser.id, values);
      setUsers(prev => prev.map(u => u.id === updated.id ? updated : u));
      message.success("User updated."); setEditUser(null);
    } catch { message.error("Failed to update user."); }
    finally { setSubmitting(false); }
  };

  const handleToggleActive = async (user: AuthUser) => {
    try {
      const updated = await updateUser(user.id, { is_active: !user.is_active });
      setUsers(prev => prev.map(u => u.id === updated.id ? updated : u));
      message.success(`User ${updated.is_active ? "activated" : "deactivated"}.`);
    } catch (err: unknown) {
      const detail = (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail;
      message.error(detail ?? "Failed to update.");
    }
  };

  const handleDelete = async (user: AuthUser) => {
    try {
      await deleteUser(user.id);
      setUsers(prev => prev.filter(u => u.id !== user.id));
      message.success(`${user.email} deleted.`);
    } catch { message.error("Failed to delete user."); }
  };

  const columns = [
    {
      title: "User",
      key: "user",
      render: (_: unknown, u: AuthUser) => (
        <Space>
          <div style={{
            width: 36, height: 36, borderRadius: 10, flexShrink: 0,
            background: u.role === "ADMIN"
              ? "linear-gradient(135deg, #2563eb, #0ea5e9)"
              : "linear-gradient(135deg, #475569, #334155)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 12, fontWeight: 700, color: "#fff",
          }}>
            {u.first_name[0]}{u.last_name[0]}
          </div>
          <div>
            <div style={{ fontWeight: 600, fontSize: 13, color: "var(--text-primary)" }}>
              {u.first_name} {u.last_name}
            </div>
            <Text type="secondary" style={{ fontSize: 12 }}>{u.email}</Text>
          </div>
        </Space>
      ),
    },
    {
      title: "Role",
      key: "role",
      render: (_: unknown, u: AuthUser) => (
        <Tag color={u.role === "ADMIN" ? "blue" : "default"} style={{ fontWeight: 600, borderRadius: 6 }}>
          {u.role}
        </Tag>
      ),
    },
    {
      title: "Status",
      key: "status",
      render: (_: unknown, u: AuthUser) => (
        <Badge status={u.is_active ? "success" : "error"} text={
          <span style={{ fontSize: 13, fontWeight: 500 }}>{u.is_active ? "Active" : "Inactive"}</span>
        } />
      ),
    },
    {
      title: "Joined",
      key: "date_joined",
      render: (_: unknown, u: AuthUser) => (
        <Text style={{ fontSize: 13, color: "var(--text-secondary)" }}>
          {new Date(u.date_joined).toLocaleDateString()}
        </Text>
      ),
    },
    {
      title: "Active",
      key: "toggle",
      render: (_: unknown, u: AuthUser) => (
        <Switch checked={u.is_active} onChange={() => handleToggleActive(u)} size="small" />
      ),
    },
    {
      title: "",
      key: "actions",
      render: (_: unknown, u: AuthUser) => (
        <Space>
          <Button
            icon={<EditOutlined />} size="small" type="text"
            style={{ borderRadius: 7 }}
            onClick={() => { setEditUser(u); editForm.setFieldsValue({ first_name: u.first_name, last_name: u.last_name, role: u.role }); }}
          />
          <Popconfirm title="Delete user?" description="This cannot be undone." onConfirm={() => handleDelete(u)} okText="Delete" okButtonProps={{ danger: true }}>
            <Button icon={<DeleteOutlined />} size="small" type="text" danger style={{ borderRadius: 7 }} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const modalFormStyle = { marginTop: 16 };
  const roleOptions = [{ value: "STAFF", label: "Staff" }, { value: "ADMIN", label: "Admin" }];

  return (
    <div>
      {/* Header row */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <div>
          <div style={{ fontSize: 15, fontWeight: 700, color: "var(--text-primary)" }}>All Users</div>
          <div style={{ fontSize: 13, color: "var(--text-secondary)", marginTop: 2 }}>
            {users.length} member{users.length !== 1 ? "s" : ""}
          </div>
        </div>
        <Button
          type="primary" icon={<PlusOutlined />} onClick={() => setCreateOpen(true)}
          style={{
            borderRadius: 9, fontWeight: 600, height: 38,
            background: "linear-gradient(135deg, var(--blue) 0%, #1d4ed8 100%)",
            border: "none", boxShadow: "0 2px 8px rgba(37,99,235,0.3)",
          }}
        >
          Add User
        </Button>
      </div>

      {/* Table */}
      <div style={{
        background: "#fff", borderRadius: "var(--radius)",
        border: "1px solid var(--border)", boxShadow: "var(--shadow)",
        overflow: "hidden",
      }}>
        <Table
          dataSource={users} columns={columns} rowKey="id"
          loading={loading} pagination={{ pageSize: 10 }}
          style={{ fontFamily: "var(--font)" }}
        />
      </div>

      {/* Create modal */}
      <Modal title={<span style={{ fontFamily: "var(--font)", fontWeight: 700 }}>Add New User</span>}
        open={createOpen} onCancel={() => { setCreateOpen(false); createForm.resetFields(); }}
        onOk={() => createForm.submit()} confirmLoading={submitting} okText="Create User"
        okButtonProps={{ style: { borderRadius: 8, fontWeight: 600 } }}
      >
        <Form form={createForm} layout="vertical" onFinish={handleCreate} style={modalFormStyle}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Form.Item label="First name" name="first_name" rules={[{ required: true, message: "Required" }]}>
              <Input style={{ borderRadius: 8 }} />
            </Form.Item>
            <Form.Item label="Last name" name="last_name" rules={[{ required: true, message: "Required" }]}>
              <Input style={{ borderRadius: 8 }} />
            </Form.Item>
          </div>
          <Form.Item label="Email address" name="email" rules={[{ required: true, type: "email", message: "Valid email required" }]}>
            <Input type="email" style={{ borderRadius: 8 }} />
          </Form.Item>
          <Form.Item label="Role" name="role" initialValue="STAFF" rules={[{ required: true }]}>
            <Select options={roleOptions} style={{ borderRadius: 8 }} />
          </Form.Item>
          <Form.Item label="Password" name="password" rules={[{ required: true, min: 8, message: "Minimum 8 characters" }]}>
            <Input.Password placeholder="Minimum 8 characters" style={{ borderRadius: 8 }} />
          </Form.Item>
        </Form>
      </Modal>

      {/* Edit modal */}
      <Modal title={<span style={{ fontFamily: "var(--font)", fontWeight: 700 }}>Edit User</span>}
        open={!!editUser} onCancel={() => setEditUser(null)}
        onOk={() => editForm.submit()} confirmLoading={submitting} okText="Save Changes"
        okButtonProps={{ style: { borderRadius: 8, fontWeight: 600 } }}
      >
        <Form form={editForm} layout="vertical" onFinish={handleEdit} style={modalFormStyle}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Form.Item label="First name" name="first_name" rules={[{ required: true }]}>
              <Input style={{ borderRadius: 8 }} />
            </Form.Item>
            <Form.Item label="Last name" name="last_name" rules={[{ required: true }]}>
              <Input style={{ borderRadius: 8 }} />
            </Form.Item>
          </div>
          <Form.Item label="Role" name="role" rules={[{ required: true }]}>
            <Select options={roleOptions} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
