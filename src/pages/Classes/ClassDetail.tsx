/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeftOutlined,
  ExperimentOutlined,
  TeamOutlined,
  BookOutlined,
  UserOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  BugOutlined
} from '@ant-design/icons';
import {
  Row,
  Col,
  Typography,
  Button,
  Card,
  Statistic,
  Tag,
  Table,
  message,
  Progress,
  Modal,
  Form,
  Input,
  Select,
  Tooltip,
  Popconfirm
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import NotFoundPage from '../NotFounds/NotFoundPage';

const { Title, Text } = Typography;
const { Option } = Select;

// Biology Class data type - now with single subject
export type BiologyClassDto = {
  id: string;
  name: string;
  grade: number;
  description?: string;
  subject: string; // Single biology subject
  subjectName: string; // Biology subject name
  teacher: string;
  studentsCount: number;
  maxStudents: number;
  status: 'active' | 'inactive';
  createdDate: string;
  schedule?: string;
  subjectMastery: number; // Single mastery percentage for biology
  biologyTopics: BiologyTopic[]; // Biology-specific topics
};

// Biology topics type
export type BiologyTopic = {
  id: string;
  name: string;
  masteryLevel: number;
  questionsCount: number;
  difficulty: 'easy' | 'medium' | 'hard';
};

// Mock biology teachers data

// Mock students data for biology classes
export type BiologyStudentDto = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  password?: string;
  classId: string;
  attendancePercentage: number;
  averageScore: number;
  status: 'active' | 'inactive';
  strongTopics: string[]; // Biology topics student is strong in
  weakTopics: string[]; // Biology topics student needs help with
};

const mockBiologyStudents: BiologyStudentDto[] = [
  {
    id: 'student-001',
    fullName: 'Ali Valiyev',
    email: 'ali.valiyev@uzla.uz',
    phone: '+998901234567',
    classId: 'class-001',
    attendancePercentage: 95,
    averageScore: 88,
    status: 'active',
    strongTopics: ['Hujayra biologiyasi', 'Genetika'],
    weakTopics: ['Biokimyo']
  },
  {
    id: 'student-002',
    fullName: 'Gulnoza Karimova',
    email: 'gulnoza.karimova@uzla.uz',
    phone: '+998901234568',
    classId: 'class-001',
    attendancePercentage: 92,
    averageScore: 91,
    status: 'active',
    strongTopics: ['Genetika', 'Evolyutsiya'],
    weakTopics: ['Anatomiya']
  },
  {
    id: 'student-003',
    fullName: 'Davron Saidov',
    email: 'davron.saidov@uzla.uz',
    phone: '+998901234569',
    classId: 'class-001',
    attendancePercentage: 80,
    averageScore: 75,
    status: 'inactive',
    strongTopics: ['Ekologiya'],
    weakTopics: ['Genetika', 'Biokimyo']
  },
  {
    id: 'student-004',
    fullName: 'Zarina Alimova',
    email: 'zarina.alimova@uzla.uz',
    phone: '+998901234570',
    classId: 'class-002',
    attendancePercentage: 98,
    averageScore: 94,
    status: 'active',
    strongTopics: ['Anatomiya', 'Fiziologiya'],
    weakTopics: ['Molekulyar biologiya']
  },
  {
    id: 'student-005',
    fullName: 'Farhod Olimov',
    email: 'farhod.olimov@uzla.uz',
    phone: '+998901234571',
    classId: 'class-002',
    attendancePercentage: 85,
    averageScore: 79,
    status: 'active',
    strongTopics: ['Botanika'],
    weakTopics: ['Genetika']
  },
  {
    id: 'student-006',
    fullName: 'Lola Rustamova',
    email: 'lola.rustamova@uzla.uz',
    phone: '+998901234572',
    classId: 'class-003',
    attendancePercentage: 90,
    averageScore: 85,
    status: 'active',
    strongTopics: ['Ekologiya', 'Evolyutsiya'],
    weakTopics: ['Biokimyo']
  }
];

// Biology questions data
export type BiologyQuestionDto = {
  id: string;
  text: string;
  topic: string;
  level: 'easy' | 'medium' | 'hard';
};

const generateMockBiologyClasses = (): BiologyClassDto[] => [
  {
    id: 'class-001',
    name: '10-A Biologiya sinfi',
    grade: 10,
    description: "Umumiy biologiya va hujayra biologiyasi yo'nalishi",
    subject: 'biology',
    subjectName: 'Biologiya',
    teacher: '1',
    studentsCount: 28,
    maxStudents: 30,
    status: 'active',
    createdDate: '2023-09-01',
    schedule: 'Dushanba, Chorshanba, Juma',
    subjectMastery: 85,
    biologyTopics: [
      {
        id: 'cell-bio',
        name: 'Hujayra biologiyasi',
        masteryLevel: 90,
        questionsCount: 15,
        difficulty: 'medium'
      },
      {
        id: 'genetics',
        name: 'Genetika',
        masteryLevel: 80,
        questionsCount: 12,
        difficulty: 'hard'
      },
      {
        id: 'ecology',
        name: 'Ekologiya',
        masteryLevel: 85,
        questionsCount: 10,
        difficulty: 'easy'
      }
    ]
  },
  {
    id: 'class-002',
    name: '11-B Biologiya sinfi',
    grade: 11,
    description: "Molekulyar biologiya va genetika yo'nalishi",
    subject: 'biology',
    subjectName: 'Biologiya',
    teacher: '2',
    studentsCount: 25,
    maxStudents: 30,
    status: 'active',
    createdDate: '2023-09-01',
    schedule: 'Seshanba, Payshanba, Shanba',
    subjectMastery: 92,
    biologyTopics: [
      {
        id: 'mol-bio',
        name: 'Molekulyar biologiya',
        masteryLevel: 95,
        questionsCount: 18,
        difficulty: 'hard'
      },
      {
        id: 'genetics',
        name: 'Genetika',
        masteryLevel: 88,
        questionsCount: 20,
        difficulty: 'hard'
      },
      {
        id: 'biochem',
        name: 'Biokimyo',
        masteryLevel: 85,
        questionsCount: 14,
        difficulty: 'hard'
      }
    ]
  },
  {
    id: 'class-003',
    name: '9-A Biologiya sinfi',
    grade: 9,
    description: "Umumiy biologiya va tabiat o'rganish",
    subject: 'biology',
    subjectName: 'Biologiya',
    teacher: '3',
    studentsCount: 22,
    maxStudents: 25,
    status: 'active',
    createdDate: '2023-09-01',
    schedule: 'Dushanba, Seshanba, Juma',
    subjectMastery: 78,
    biologyTopics: [
      {
        id: 'basic-bio',
        name: 'Umumiy biologiya',
        masteryLevel: 82,
        questionsCount: 12,
        difficulty: 'easy'
      },
      {
        id: 'botany',
        name: 'Botanika',
        masteryLevel: 75,
        questionsCount: 10,
        difficulty: 'easy'
      },
      {
        id: 'zoology',
        name: 'Zoologiya',
        masteryLevel: 80,
        questionsCount: 8,
        difficulty: 'medium'
      }
    ]
  }
];

export default function BiologyClassDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [classData, setClassData] = useState<BiologyClassDto | null>(null);
  const [classStudents, setClassStudents] = useState<BiologyStudentDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [isStudentModalVisible, setIsStudentModalVisible] = useState(false);
  const [editingStudent, setEditingStudent] =
    useState<BiologyStudentDto | null>(null);
  const [studentForm] = Form.useForm();

  useEffect(() => {
    setLoading(true);
    // Simulate fetching data
    const foundClass = generateMockBiologyClasses().find((c) => c.id === id);
    if (foundClass) {
      setClassData(foundClass);
      const studentsInClass = mockBiologyStudents.filter(
        (s) => s.classId === id
      );
      setClassStudents(studentsInClass);
    } else {
      message.error('Biologiya sinfi topilmadi!');
      navigate('/dashboard/classes');
    }
    setLoading(false);
  }, [id, navigate]);

  // Get biology teacher name by ID
  // Handle create new student
  const handleCreateStudent = () => {
    setEditingStudent(null);
    setIsStudentModalVisible(true);
    studentForm.resetFields();
  };

  // Handle edit student
  const handleEditStudent = (student: BiologyStudentDto) => {
    setEditingStudent(student);
    setIsStudentModalVisible(true);
    studentForm.setFieldsValue({
      fullName: student.fullName,
      email: student.email,
      phone: student.phone,
      status: student.status
    });
  };

  // Handle delete student
  const handleDeleteStudent = (id: string) => {
    setClassStudents(classStudents.filter((student) => student.id !== id));
    message.success("O'quvchi muvaffaqiyatli o'chirildi");
  };

  // Handle student form submit
  const handleStudentSubmit = (values: any) => {
    if (editingStudent) {
      // Update existing student
      const updatedData: any = { ...values };
      if (!values.password) {
        delete updatedData.password;
        delete updatedData.confirmPassword;
      }
      setClassStudents(
        classStudents.map((student) =>
          student.id === editingStudent.id
            ? { ...student, ...updatedData }
            : student
        )
      );
      message.success("O'quvchi muvaffaqiyatli yangilandi");
    } else {
      // Create new student
      const newStudent: BiologyStudentDto = {
        id: Date.now().toString(),
        fullName: values.fullName,
        email: values.email,
        phone: values.phone,
        classId: id!,
        attendancePercentage: 0,
        averageScore: 0,
        status: values.status,
        strongTopics: [],
        weakTopics: []
      };
      setClassStudents([...classStudents, newStudent]);
      message.success("Yangi o'quvchi muvaffaqiyatli qo'shildi");
    }
    setIsStudentModalVisible(false);
    studentForm.resetFields();
    setEditingStudent(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-100px)] dark:text-white">
        Yuklanmoqda...
      </div>
    );
  }

  if (!classData) {
    return <NotFoundPage />;
  }

  // Calculate statistics for the biology class
  const activeStudents = classStudents.filter(
    (s) => s.status === 'active'
  ).length;
  const inactiveStudents = classStudents.filter(
    (s) => s.status === 'inactive'
  ).length;
  const avgAttendance =
    classStudents.length > 0
      ? Math.round(
          classStudents.reduce((sum, s) => sum + s.attendancePercentage, 0) /
            classStudents.length
        )
      : 0;
  const avgScore =
    classStudents.length > 0
      ? Math.round(
          classStudents.reduce((sum, s) => sum + s.averageScore, 0) /
            classStudents.length
        )
      : 0;
  const fillPercentage = Math.round(
    (classData.studentsCount / classData.maxStudents) * 100
  );

  const studentColumns: ColumnsType<BiologyStudentDto> = [
    {
      title: "O'quvchi",
      key: 'fullName',
      render: (record: BiologyStudentDto) => (
        <div className="flex items-center gap-2">
          <UserOutlined className="text-slate-400" />
          <div>
            <div className="font-medium text-slate-900 dark:text-white">
              {record.fullName}
            </div>
            <div className="text-sm text-slate-500">{record.email}</div>
            <div className="text-sm text-slate-500">{record.phone}</div>
          </div>
        </div>
      )
    },
    {
      title: 'Davomat',
      dataIndex: 'attendancePercentage',
      key: 'attendancePercentage',
      render: (percent: number) => (
        <div className="flex items-center gap-2">
          <Progress
            percent={percent}
            size="small"
            showInfo={false}
            className="w-20"
          />
          <Text className="text-sm text-slate-600 dark:text-slate-400">
            {percent}%
          </Text>
        </div>
      )
    },
    {
      title: 'Biologiya balli',
      dataIndex: 'averageScore',
      key: 'averageScore',
      render: (score: number) => (
        <Tag color={score >= 80 ? 'green' : score >= 60 ? 'orange' : 'red'}>
          {score}
        </Tag>
      )
    },
    {
      title: 'Kuchli mavzular',
      dataIndex: 'strongTopics',
      key: 'strongTopics',
      render: (topics: string[]) => (
        <div className="flex flex-wrap gap-1">
          {topics.slice(0, 2).map((topic, index) => (
            <Tag key={index} color="green" className="text-xs">
              {topic}
            </Tag>
          ))}
          {topics.length > 2 && (
            <Tag className="text-xs">+{topics.length - 2}</Tag>
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
      )
    },
    {
      title: 'Amallar',
      key: 'actions',
      render: (record: BiologyStudentDto) => (
        <div className="flex gap-2">
          <Tooltip title="Tahrirlash">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => handleEditStudent(record)}
              className="text-blue-600 hover:text-blue-800"
            />
          </Tooltip>
          <Popconfirm
            title="O'quvchini o'chirish"
            description="Haqiqatan ham bu o'quvchini o'chirmoqchimisiz?"
            onConfirm={() => handleDeleteStudent(record.id)}
            okText="Ha"
            cancelText="Yo'q"
          >
            <Tooltip title="O'chirish">
              <Button
                type="text"
                icon={<DeleteOutlined />}
                className="text-red-600 hover:text-red-800"
              />
            </Tooltip>
          </Popconfirm>
        </div>
      )
    }
  ];

  return (
    <div className="p-6 space-y-6 min-h-full bg-slate-50 dark:bg-[#0f0f0f]">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <Button
            type="text"
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate('/dashboard/classes')}
            className="!text-slate-600 dark:!text-slate-400 !mb-2"
          >
            Sinflar ro'yxatiga qaytish
          </Button>
          <Title level={2} className="!mb-2 text-slate-900 dark:text-white">
            <BugOutlined className="mr-2 text-green-600" />
            {classData.name} ({classData.grade}-sinf)
          </Title>
          <Text className="text-slate-600 dark:text-slate-400">
            {classData.description}
          </Text>
        </div>
      </div>

      {/* Statistics */}
      <Row gutter={[24, 24]}>
        <Col xs={24} sm={8} lg={4}>
          <div className="bg-gradient-to-br p-4 rounded-lg from-green-400 to-green-600 border-0">
            <Statistic
              title={<span className="text-white">Jami O'quvchilar</span>}
              value={classData.studentsCount}
              prefix={<TeamOutlined className="text-white" />}
              valueStyle={{
                fontSize: '2rem',
                fontWeight: 'bold',
                color: 'white'
              }}
            />
          </div>
        </Col>
        <Col xs={24} sm={8} lg={4}>
          <div className="bg-gradient-to-br p-4 rounded-lg from-blue-400 to-blue-600 border-0">
            <Statistic
              title={<span className="text-white">Faol O'quvchilar</span>}
              value={activeStudents}
              prefix={<CheckCircleOutlined className="text-white" />}
              valueStyle={{
                fontSize: '2rem',
                fontWeight: 'bold',
                color: 'white'
              }}
            />
          </div>
        </Col>
        <Col xs={24} sm={8} lg={4}>
          <div className="bg-gradient-to-br p-4 rounded-lg from-red-400 to-red-600 border-0">
            <Statistic
              title={<span className="text-white">Nofaol O'quvchilar</span>}
              value={inactiveStudents}
              prefix={<CloseCircleOutlined className="text-white" />}
              valueStyle={{
                fontSize: '2rem',
                fontWeight: 'bold',
                color: 'white'
              }}
            />
          </div>
        </Col>
        <Col xs={24} sm={8} lg={4}>
          <div className="bg-gradient-to-br p-4 rounded-lg from-purple-400 to-purple-600 border-0">
            <Statistic
              title={<span className="text-white">O'rtacha Davomat</span>}
              value={avgAttendance}
              suffix="%"
              prefix={<ClockCircleOutlined className="text-white" />}
              valueStyle={{
                fontSize: '2rem',
                fontWeight: 'bold',
                color: 'white'
              }}
            />
          </div>
        </Col>
        <Col xs={24} sm={8} lg={4}>
          <div className="bg-gradient-to-br p-4 rounded-lg from-orange-400 to-orange-600 border-0">
            <Statistic
              title={
                <span className="text-white">Biologiya O'rtacha Ball</span>
              }
              value={avgScore}
              prefix={<BookOutlined className="text-white" />}
              valueStyle={{
                fontSize: '2rem',
                fontWeight: 'bold',
                color: 'white'
              }}
            />
          </div>
        </Col>
        <Col xs={24} sm={8} lg={4}>
          <div className="bg-gradient-to-br p-4 rounded-lg from-[#52c41a] to-[#389e0d] border-0">
            <Statistic
              title={<span className="text-white">To'ldirilganlik</span>}
              value={fillPercentage}
              suffix="%"
              prefix={<ExperimentOutlined className="text-white" />}
              valueStyle={{
                fontSize: '2rem',
                fontWeight: 'bold',
                color: 'white'
              }}
            />
          </div>
        </Col>
      </Row>

      {/* Biology Students Table */}
      <Card
        className="bg-white dark:bg-[#101010] border-slate-200 dark:border-slate-800"
        title={
          <div className="flex items-center justify-between">
            <Title level={4} className="!mb-0 text-slate-900 dark:text-white">
              <TeamOutlined className="mr-2 text-green-600" />
              Biologiya sinfi o'quvchilari ({classStudents.length} ta)
            </Title>
            <Button
              type="primary"
              size="middle"
              icon={<PlusOutlined />}
              onClick={handleCreateStudent}
              className="bg-green-500 hover:bg-green-600 border-green-100"
            >
              Yangi o'quvchi qo'shish
            </Button>
          </div>
        }
      >
        {classStudents.length > 0 ? (
          <Table
            columns={studentColumns}
            dataSource={classStudents}
            rowKey="id"
            pagination={{ pageSize: 5 }}
            scroll={{ x: 600 }}
            size="middle"
          />
        ) : (
          <Text className="text-slate-600 dark:text-slate-400">
            Bu biologiya sinfida o'quvchilar mavjud emas.
          </Text>
        )}
      </Card>

      {/* Add/Edit Student Modal */}
      <Modal
        title={
          editingStudent
            ? "Biologiya o'quvchisini tahrirlash"
            : "Yangi biologiya o'quvchisi qo'shish"
        }
        open={isStudentModalVisible}
        onCancel={() => {
          setIsStudentModalVisible(false);
          studentForm.resetFields();
          setEditingStudent(null);
        }}
        onOk={() => studentForm.submit()}
        okText="Saqlash"
        cancelText="Bekor qilish"
        okButtonProps={{
          style: { backgroundColor: '#52c41a', border: 'none' }
        }}
        width={700}
      >
        <Form
          form={studentForm}
          layout="vertical"
          onFinish={handleStudentSubmit}
        >
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

          {/* Password Section */}
          <div className="border-t pt-4 mt-4">
            <Title
              level={5}
              className="!mb-4 text-slate-700 dark:text-slate-300"
            >
              {editingStudent ? "Parolni o'zgartirish (ixtiyoriy)" : 'Parol'}
            </Title>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="password"
                  label="Parol"
                  rules={
                    editingStudent
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
                  <Input.Password
                    placeholder={
                      editingStudent
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
                  <Input.Password placeholder="Parolni qayta kiriting" />
                </Form.Item>
              </Col>
            </Row>
          </div>
        </Form>
      </Modal>
    </div>
  );
}
