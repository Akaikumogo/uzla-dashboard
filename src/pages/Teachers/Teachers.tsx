/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect } from 'react';
import {
  Users,
  Plus,
  Search,
  BookOpen,
  Mail,
  Phone,
  Edit,
  Trash2
} from 'lucide-react';
import {
  Row,
  Col,
  Typography,
  Button,
  Table,
  Tag,
  Input,
  Select,
  Modal,
  Form,
  message,
  Statistic,
  Tooltip,
  Popconfirm,
  Card
} from 'antd';
import type { ColumnsType } from 'antd/es/table';

const { Title, Text } = Typography;
const { Search: AntSearch } = Input;
const { Option } = Select;
const { TextArea } = Input;
const { Password } = Input;

// Teacher data type
export type TeacherDto = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  subjects: string[];
  bio?: string;
  status: 'active' | 'inactive';
  createdDate: string;
  studentsCount: number;
};

// Mock subjects data
const mockSubjects = [
  { id: '1', name: 'Matematika' },
  { id: '2', name: 'Fizika' },
  { id: '3', name: 'Kimyo' },
  { id: '4', name: 'Biologiya' },
  { id: '5', name: 'Tarix' },
  { id: '6', name: 'Geografiya' },
  { id: '7', name: 'Adabiyot' }
];

// Generate mock teachers
const generateMockTeachers = (): TeacherDto[] => [
  {
    id: 'teacher-001',
    fullName: 'Ahmadjon Karimov',
    email: 'ahmadjon@uzla.uz',
    phone: '+998901234567',
    subjects: ['1', '2'],
    bio: "Matematika va fizika bo'yicha 10 yillik tajribaga ega",
    status: 'active',
    createdDate: '2023-01-15',
    studentsCount: 245
  },
  {
    id: 'teacher-002',
    fullName: 'Malika Tosheva',
    email: 'malika@uzla.uz',
    phone: '+998901234568',
    subjects: ['3'],
    bio: 'Kimyo fani mutaxassisi',
    status: 'active',
    createdDate: '2023-03-20',
    studentsCount: 189
  },
  {
    id: 'teacher-003',
    fullName: 'Bobur Alimov',
    email: 'bobur@uzla.uz',
    phone: '+998901234569',
    subjects: ['4', '5'],
    bio: "Biologiya va tarix o'qituvchisi",
    status: 'active',
    createdDate: '2023-06-10',
    studentsCount: 156
  },
  {
    id: 'teacher-004',
    fullName: 'Nilufar Rahimova',
    email: 'nilufar@uzla.uz',
    phone: '+998901234570',
    subjects: ['6', '7'],
    bio: "Geografiya va adabiyot fanlari bo'yicha mutaxassis",
    status: 'inactive',
    createdDate: '2023-09-05',
    studentsCount: 98
  },
  {
    id: 'teacher-005',
    fullName: 'Jasur Nazarov',
    email: 'jasur@uzla.uz',
    phone: '+998901234571',
    subjects: ['1', '3'],
    bio: "Matematika va kimyo o'qituvchisi",
    status: 'active',
    createdDate: '2024-01-20',
    studentsCount: 203
  }
];

export default function TeachersPage() {
  const [teachers, setTeachers] = useState<TeacherDto[]>(
    generateMockTeachers()
  );
  const [filteredTeachers, setFilteredTeachers] = useState<TeacherDto[]>(
    generateMockTeachers()
  );
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<TeacherDto | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [form] = Form.useForm();

  // Get subject name by ID
  const getSubjectName = (subjectId: string) => {
    const subject = mockSubjects.find((s) => s.id === subjectId);
    return subject ? subject.name : 'Unknown';
  };

  // Filter teachers
  useEffect(() => {
    let filtered = teachers;

    if (searchTerm) {
      filtered = filtered.filter(
        (teacher) =>
          teacher.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          teacher.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          teacher.phone.includes(searchTerm)
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter((teacher) => teacher.status === statusFilter);
    }

    setFilteredTeachers(filtered);
  }, [teachers, searchTerm, statusFilter]);

  // Statistics
  const stats = {
    total: teachers.length,
    active: teachers.filter((t) => t.status === 'active').length,
    inactive: teachers.filter((t) => t.status === 'inactive').length,
    totalStudents: teachers.reduce((acc, t) => acc + t.studentsCount, 0)
  };

  // Table columns
  const columns: ColumnsType<TeacherDto> = [
    {
      title: "O'qituvchi",
      key: 'teacher',
      render: (record: TeacherDto) => (
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-[#6bd281] rounded-full flex items-center justify-center">
            <span className="text-white font-semibold text-lg">
              {record.fullName
                .split(' ')
                .map((n) => n[0])
                .join('')}
            </span>
          </div>
          <div>
            <div className="font-medium text-slate-900 dark:text-white">
              {record.fullName}
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <Mail size={12} />
              {record.email}
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <Phone size={12} />
              {record.phone}
            </div>
          </div>
        </div>
      )
    },
    {
      title: 'Biriktirilgan fanlar',
      dataIndex: 'subjects',
      key: 'subjects',
      render: (subjects: string[]) => (
        <div className="flex flex-wrap gap-1">
          {subjects.length > 0 ? (
            subjects.map((subjectId) => (
              <Tag key={subjectId} color="blue" className="text-xs">
                {getSubjectName(subjectId)}
              </Tag>
            ))
          ) : (
            <Tag color="default">Fanlar tayinlanmagan</Tag>
          )}
        </div>
      )
    },

    {
      title: 'Holat',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'active' ? 'green' : 'red'}>
          {status === 'active' ? 'Faol' : 'Nofaol'}
        </Tag>
      ),
      filters: [
        { text: 'Faol', value: 'active' },
        { text: 'Nofaol', value: 'inactive' }
      ],
      onFilter: (value: any, record: TeacherDto) => record.status === value
    },
    {
      title: 'Amallar',
      key: 'actions',
      render: (record: TeacherDto) => (
        <div className="flex gap-2">
          <Tooltip title="Tahrirlash">
            <Button
              type="text"
              icon={<Edit size={16} />}
              onClick={() => handleEdit(record)}
              className="text-blue-600 hover:text-blue-800"
            />
          </Tooltip>
          <Popconfirm
            title="O'qituvchini o'chirish"
            description="Haqiqatan ham bu o'qituvchini o'chirmoqchimisiz?"
            onConfirm={() => handleDelete(record.id)}
            okText="Ha"
            cancelText="Yo'q"
          >
            <Tooltip title="O'chirish">
              <Button
                type="text"
                icon={<Trash2 size={16} />}
                className="text-red-600 hover:text-red-800"
              />
            </Tooltip>
          </Popconfirm>
        </div>
      )
    }
  ];

  // Handle create new teacher
  const handleCreate = () => {
    setEditingTeacher(null);
    setIsModalVisible(true);
    form.resetFields();
  };

  // Handle edit teacher
  const handleEdit = (teacher: TeacherDto) => {
    setEditingTeacher(teacher);
    setIsModalVisible(true);
    form.setFieldsValue({
      fullName: teacher.fullName,
      email: teacher.email,
      phone: teacher.phone,
      subjects: teacher.subjects,
      bio: teacher.bio,
      status: teacher.status
    });
  };

  // Handle delete teacher
  const handleDelete = (id: string) => {
    setTeachers(teachers.filter((teacher) => teacher.id !== id));
    message.success("O'qituvchi muvaffaqiyatli o'chirildi");
  };

  // Handle form submit
  const handleSubmit = (values: any) => {
    if (editingTeacher) {
      // Update existing teacher
      const updatedData: any = { ...values };
      // Only include password if it was provided
      if (!values.password) {
        delete updatedData.password;
        delete updatedData.confirmPassword;
      }

      setTeachers(
        teachers.map((teacher) =>
          teacher.id === editingTeacher.id
            ? { ...teacher, ...updatedData }
            : teacher
        )
      );
      message.success("O'qituvchi muvaffaqiyatli yangilandi");
    } else {
      // Create new teacher
      const newTeacher: TeacherDto = {
        id: Date.now().toString(),
        fullName: values.fullName,
        email: values.email,
        phone: values.phone,
        subjects: values.subjects || [],
        bio: values.bio,
        status: values.status,
        createdDate: new Date().toISOString().split('T')[0],
        studentsCount: 0
      };
      setTeachers([...teachers, newTeacher]);
      message.success("Yangi o'qituvchi muvaffaqiyatli qo'shildi");
    }

    setIsModalVisible(false);
    form.resetFields();
    setEditingTeacher(null);
  };

  return (
    <div className="p-6 space-y-6 min-h-full bg-slate-50 dark:bg-[#0f0f0f]">
      {/* Statistics */}
      <Row gutter={[24, 24]}>
        <Col xs={24} sm={8}>
          <div className="bg-gradient-to-br p-4 rounded-lg from-green-400 to-green-800 border-0">
            <Statistic
              title={<span className="text-white">Jami O'qituvchilar</span>}
              value={stats.total}
              prefix={<Users className="text-white" />}
              valueStyle={{
                fontSize: '2rem',
                fontWeight: 'bold',
                color: 'white'
              }}
            />
          </div>
        </Col>
        <Col xs={24} sm={8}>
          <div className="bg-gradient-to-br p-4 rounded-lg from-blue-400 to-blue-600 border-0">
            <Statistic
              title={<span className="text-white">Faol O'qituvchilar</span>}
              value={stats.active}
              prefix={<Users className="text-white" />}
              valueStyle={{
                fontSize: '2rem',
                fontWeight: 'bold',
                color: 'white'
              }}
            />
          </div>
        </Col>
        <Col xs={24} sm={8}>
          <div className="bg-gradient-to-br p-4 rounded-lg from-orange-400 to-orange-600 border-0">
            <Statistic
              title={<span className="text-white">Fanlar</span>}
              value={mockSubjects.length}
              prefix={<BookOpen className="text-white" />}
              valueStyle={{
                fontSize: '2rem',
                fontWeight: 'bold',
                color: 'white'
              }}
            />
          </div>
        </Col>
      </Row>

      <div className="space-y-4">
        <Card className="bg-white dark:bg-[#101010] border-slate-200 dark:border-slate-800 my-2">
          <Row gutter={[16, 16]} align="middle">
            <Col xs={24} sm={8}>
              <AntSearch
                placeholder="O'qituvchilarni qidirish..."
                allowClear
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                prefix={<Search size={16} />}
              />
            </Col>
            <Col xs={24} sm={4}>
              <Select
                placeholder="Holat"
                value={statusFilter}
                onChange={setStatusFilter}
                style={{ width: '100%' }}
              >
                <Option value="all">Barcha holatlar</Option>
                <Option value="active">Faol</Option>
                <Option value="inactive">Nofaol</Option>
              </Select>
            </Col>
            <Col xs={24} sm={12}>
              <div className="flex justify-end">
                <Text className="text-slate-600 dark:text-slate-400">
                  Jami: {filteredTeachers.length} ta o'qituvchi
                </Text>
              </div>
            </Col>
          </Row>
        </Card>
      </div>

      {/* Teachers Table */}
      <Card
        className="bg-white dark:bg-[#101010] border-slate-200 dark:border-slate-800 mt-4"
        title={
          <div className="flex items-center justify-between">
            <Title level={4} className="!mb-0 text-slate-900 dark:text-white">
              O'qituvchilar Ro'yxati
            </Title>
            <Button
              type="primary"
              size="middle"
              icon={<Plus />}
              onClick={handleCreate}
              className="bg-green-500 hover:bg-green-600 border-green-100"
            >
              Yangi o'qituvchi qo'shish
            </Button>
          </div>
        }
      >
        <Table
          columns={columns}
          dataSource={filteredTeachers}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} / ${total} ta`
          }}
          scroll={{ x: 1000 }}
          size="middle"
        />
      </Card>

      {/* Add/Edit Teacher Modal */}
      <Modal
        title={
          editingTeacher
            ? "O'qituvchini tahrirlash"
            : "Yangi o'qituvchi qo'shish"
        }
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
          setEditingTeacher(null);
        }}
        onOk={() => form.submit()}
        okText="Saqlash"
        cancelText="Bekor qilish"
        okButtonProps={{
          style: { backgroundColor: '#6bd281', border: 'none' }
        }}
        width={700}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="fullName"
                label="To'liq ism"
                rules={[{ required: true, message: "To'liq ismni kiriting" }]}
              >
                <Input placeholder="To'liq ismni kiriting" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="email"
                label="Email"
                rules={[{ required: true, message: 'Email kiriting' }]}
              >
                <Input placeholder="email@uzla.uz" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="phone"
                label="Telefon"
                rules={[{ required: true, message: 'Telefon kiriting' }]}
              >
                <Input placeholder="+998901234567" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="status"
                label="Holat"
                initialValue="active"
                rules={[{ required: true, message: 'Holatni tanlang' }]}
              >
                <Select>
                  <Option value="active">Faol</Option>
                  <Option value="inactive">Nofaol</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="subjects" label="Biriktirilgan fanlar">
            <Select mode="multiple" placeholder="Fanlarni tanlang" allowClear>
              {mockSubjects.map((subject) => (
                <Option key={subject.id} value={subject.id}>
                  {subject.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="bio" label="Qisqacha ma'lumot">
            <TextArea
              rows={3}
              placeholder="O'qituvchi haqida qisqacha ma'lumot..."
            />
          </Form.Item>

          {/* Password Section */}
          <div className="border-t pt-4 mt-4">
            <Title
              level={5}
              className="!mb-4 text-slate-700 dark:text-slate-300"
            >
              {editingTeacher ? "Parolni o'zgartirish (ixtiyoriy)" : 'Parol'}
            </Title>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="password"
                  label="Parol"
                  rules={
                    editingTeacher
                      ? []
                      : [
                          { required: true, message: 'Parol kiriting' },
                          {
                            min: 6,
                            message:
                              "Parol kamida 6 ta belgidan iborat bo'lishi kerak"
                          }
                        ]
                  }
                >
                  <Password
                    placeholder={
                      editingTeacher
                        ? "Yangi parol (bo'sh qoldirish mumkin)"
                        : 'Parol kiriting'
                    }
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="confirmPassword"
                  label="Parolni tasdiqlash"
                  dependencies={['password']}
                  rules={[
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        const password = getFieldValue('password');
                        if (!password && !value) {
                          return Promise.resolve();
                        }
                        if (!value && password) {
                          return Promise.reject(
                            new Error('Parolni tasdiqlang')
                          );
                        }
                        if (password && password !== value) {
                          return Promise.reject(
                            new Error('Parollar mos kelmaydi')
                          );
                        }
                        return Promise.resolve();
                      }
                    })
                  ]}
                >
                  <Password placeholder="Parolni qayta kiriting" />
                </Form.Item>
              </Col>
            </Row>
          </div>
        </Form>
      </Modal>
    </div>
  );
}
