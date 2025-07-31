/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  GraduationCap,
  Users,
  BookOpen,
  User,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  Plus,
  Edit,
  Trash2
} from 'lucide-react';
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

// Mock data (real ilovada bu ma'lumotlar API'dan keladi)
// Class data type
export type ClassDto = {
  id: string;
  name: string;
  grade: number;
  description?: string;
  subjects: string[];
  teacher: string;
  studentsCount: number;
  maxStudents: number;
  status: 'active' | 'inactive';
  createdDate: string;
  schedule?: string;
  subjectMastery: Record<string, number>; // Fanlar bo'yicha o'zlashtirish darajasi (subjectId: percentage)
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

// Mock teachers data
const mockTeachers = [
  { id: '1', name: 'Ahmadjon Karimov' },
  { id: '2', name: 'Malika Tosheva' },
  { id: '3', name: 'Bobur Alimov' },
  { id: '4', name: 'Nilufar Rahimova' },
  { id: '5', name: 'Jasur Nazarov' }
];

// Mock students data (sinfga tegishli o'quvchilar)
export type StudentDto = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  password?: string; // Parol maydoni qo'shildi
  classId: string;
  attendancePercentage: number;
  averageScore: number;
  status: 'active' | 'inactive';
};

const mockStudents: StudentDto[] = [
  {
    id: 'student-001',
    fullName: 'Ali Valiyev',
    email: 'ali.valiyev@uzla.uz',
    phone: '+998901234567',
    classId: 'class-001',
    attendancePercentage: 95,
    averageScore: 88,
    status: 'active'
  },
  {
    id: 'student-002',
    fullName: 'Gulnoza Karimova',
    email: 'gulnoza.karimova@uzla.uz',
    phone: '+998901234568',
    classId: 'class-001',
    attendancePercentage: 92,
    averageScore: 91,
    status: 'active'
  },
  {
    id: 'student-003',
    fullName: 'Davron Saidov',
    email: 'davron.saidov@uzla.uz',
    phone: '+998901234569',
    classId: 'class-001',
    attendancePercentage: 80,
    averageScore: 75,
    status: 'inactive'
  },
  {
    id: 'student-004',
    fullName: 'Zarina Alimova',
    email: 'zarina.alimova@uzla.uz',
    phone: '+998901234570',
    classId: 'class-002',
    attendancePercentage: 98,
    averageScore: 94,
    status: 'active'
  },
  {
    id: 'student-005',
    fullName: 'Farhod Olimov',
    email: 'farhod.olimov@uzla.uz',
    phone: '+998901234571',
    classId: 'class-002',
    attendancePercentage: 85,
    averageScore: 79,
    status: 'active'
  },
  {
    id: 'student-006',
    fullName: 'Lola Rustamova',
    email: 'lola.rustamova@uzla.uz',
    phone: '+998901234572',
    classId: 'class-003',
    attendancePercentage: 90,
    averageScore: 85,
    status: 'active'
  }
];

// Mock questions data with levels
export type QuestionDto = {
  id: string;
  text: string;
  subjectId: string;
  level: 'easy' | 'medium' | 'hard';
};

const mockQuestions: QuestionDto[] = [
  { id: 'q1', text: 'Pifagor teoremasi', subjectId: '1', level: 'easy' },
  { id: 'q2', text: 'Kvadrat tenglamalar', subjectId: '1', level: 'medium' },
  { id: 'q3', text: 'Integral hisob', subjectId: '1', level: 'hard' },
  { id: 'q4', text: 'Nyuton qonunlari', subjectId: '2', level: 'easy' },
  { id: 'q5', text: 'Termodinamika asoslari', subjectId: '2', level: 'medium' },
  { id: 'q6', text: 'Kvant fizikasi', subjectId: '2', level: 'hard' },
  { id: 'q7', text: 'Kimyoviy elementlar', subjectId: '3', level: 'easy' },
  { id: 'q8', text: 'Organik birikmalar', subjectId: '3', level: 'medium' },
  { id: 'q9', text: 'Reaksiya kinetikasi', subjectId: '3', level: 'hard' },
  { id: 'q10', text: 'Hujayra tuzilishi', subjectId: '4', level: 'easy' },
  { id: 'q11', text: 'Genetika asoslari', subjectId: '4', level: 'medium' },
  { id: 'q12', text: 'Evolyutsiya nazariyasi', subjectId: '4', level: 'hard' }
];

const generateMockClasses = (): ClassDto[] => [
  {
    id: 'class-001',
    name: '10-A sinf',
    grade: 10,
    description: "Matematika yo'nalishi bo'yicha ixtisoslashgan sinf",
    subjects: ['1', '2', '3'],
    teacher: '1',
    studentsCount: 28,
    maxStudents: 30,
    status: 'active',
    createdDate: '2023-09-01',
    schedule: 'Dushanba, Chorshanba, Juma',
    subjectMastery: { '1': 85, '2': 70, '3': 60 } // Matematika: 85%, Fizika: 70%, Kimyo: 60%
  },
  {
    id: 'class-002',
    name: '10-B sinf',
    grade: 10,
    description: "Biologiya yo'nalishi bo'yicha ixtisoslashgan sinf",
    subjects: ['3', '4'],
    teacher: '2',
    studentsCount: 25,
    maxStudents: 30,
    status: 'active',
    createdDate: '2023-09-01',
    schedule: 'Seshanba, Payshanba, Shanba',
    subjectMastery: { '3': 75, '4': 90 } // Kimyo: 75%, Biologiya: 90%
  },
  {
    id: 'class-003',
    name: '11-A sinf',
    grade: 11,
    description: "Fizika-matematika yo'nalishi",
    subjects: ['1', '2'],
    teacher: '3',
    studentsCount: 22,
    maxStudents: 25,
    status: 'active',
    createdDate: '2023-09-01',
    schedule: 'Dushanba, Seshanba, Juma',
    subjectMastery: { '1': 78, '2': 82 } // Matematika: 78%, Fizika: 82%
  },
  {
    id: 'class-004',
    name: '9-A sinf',
    grade: 9,
    description: "Umumiy ta'lim sinfi",
    subjects: ['1', '2', '3', '4', '5'],
    teacher: '4',
    studentsCount: 30,
    maxStudents: 32,
    status: 'active',
    createdDate: '2023-09-01',
    schedule: 'Har kuni',
    subjectMastery: { '1': 70, '2': 65, '3': 72, '4': 80, '5': 75 }
  },
  {
    id: 'class-005',
    name: '8-B sinf',
    grade: 8,
    description: "Gumanitar yo'nalish sinfi",
    subjects: ['5', '6', '7'],
    teacher: '5',
    studentsCount: 18,
    maxStudents: 30,
    status: 'inactive',
    createdDate: '2023-09-01',
    schedule: 'Dushanba, Chorshanba, Payshanba',
    subjectMastery: { '5': 68, '6': 70, '7': 65 }
  }
];

export default function ClassDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [classData, setClassData] = useState<ClassDto | null>(null);
  const [classStudents, setClassStudents] = useState<StudentDto[]>([]);
  const [loading, setLoading] = useState(true);

  const [isStudentModalVisible, setIsStudentModalVisible] = useState(false);
  const [editingStudent, setEditingStudent] = useState<StudentDto | null>(null);
  const [studentForm] = Form.useForm();

  useEffect(() => {
    setLoading(true);
    // Simulate fetching data
    const foundClass = generateMockClasses().find((c) => c.id === id);
    if (foundClass) {
      setClassData(foundClass);
      const studentsInClass = mockStudents.filter((s) => s.classId === id);
      setClassStudents(studentsInClass);
    } else {
      message.error('Sinf topilmadi!');
      navigate('/dashboard/classes'); // Or navigate to a 404 page
    }
    setLoading(false);
  }, [id, navigate]);

  // Get subject name by ID
  const getSubjectName = (subjectId: string) => {
    const subject = mockSubjects.find((s) => s.id === subjectId);
    return subject ? subject.name : 'Unknown';
  };

  // Get teacher name by ID
  const getTeacherName = (teacherId: string) => {
    const teacher = mockTeachers.find((t) => t.id === teacherId);
    return teacher ? teacher.name : 'Unknown';
  };

  // Get question counts by level for a given subject
  const getSubjectQuestionStats = (subjectId: string) => {
    const questions = mockQuestions.filter((q) => q.subjectId === subjectId);
    const stats = {
      easy: questions.filter((q) => q.level === 'easy').length,
      medium: questions.filter((q) => q.level === 'medium').length,
      hard: questions.filter((q) => q.level === 'hard').length,
      total: questions.length
    };
    return stats;
  };

  // Handle create new student
  const handleCreateStudent = () => {
    setEditingStudent(null);
    setIsStudentModalVisible(true);
    studentForm.resetFields();
  };

  // Handle edit student
  const handleEditStudent = (student: StudentDto) => {
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
      // Only include password if it was provided
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
      const newStudent: StudentDto = {
        id: Date.now().toString(),
        fullName: values.fullName,
        email: values.email,
        phone: values.phone,
        classId: id!,
        attendancePercentage: 0,
        averageScore: 0,
        status: values.status
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
    return <NotFoundPage />; // Should navigate away if not found
  }

  // Calculate statistics for the class
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

  const studentColumns: ColumnsType<StudentDto> = [
    {
      title: "O'quvchi",
      key: 'fullName',
      render: (record: StudentDto) => (
        <div className="flex items-center gap-2">
          <User size={16} className="text-slate-400" />
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
      title: "O'rtacha ball",
      dataIndex: 'averageScore',
      key: 'averageScore',
      render: (score: number) => (
        <Tag color={score >= 80 ? 'green' : score >= 60 ? 'orange' : 'red'}>
          {score}
        </Tag>
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
      render: (record: StudentDto) => (
        <div className="flex gap-2">
          <Tooltip title="Tahrirlash">
            <Button
              type="text"
              icon={<Edit size={16} />}
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
                icon={<Trash2 size={16} />}
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
            icon={<ArrowLeft size={20} />}
            onClick={() => navigate('/dashboard/classes')}
            className="!text-slate-600 dark:!text-slate-400 !mb-2"
          >
            Sinflar ro'yxatiga qaytish
          </Button>
          <Title level={2} className="!mb-2 text-slate-900 dark:text-white">
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
              prefix={<Users className="text-white" />}
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
              prefix={<CheckCircle className="text-white" />}
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
              prefix={<XCircle className="text-white" />}
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
              prefix={<Clock className="text-white" />}
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
              title={<span className="text-white">O'rtacha Ball</span>}
              value={avgScore}
              prefix={<BookOpen className="text-white" />}
              valueStyle={{
                fontSize: '2rem',
                fontWeight: 'bold',
                color: 'white'
              }}
            />
          </div>
        </Col>
        <Col xs={24} sm={8} lg={4}>
          <div className="bg-gradient-to-br p-4 rounded-lg from-[#6bd281] to-[#5bc270] border-0">
            <Statistic
              title={<span className="text-white">To'ldirilganlik</span>}
              value={fillPercentage}
              suffix="%"
              prefix={<GraduationCap className="text-white" />}
              valueStyle={{
                fontSize: '2rem',
                fontWeight: 'bold',
                color: 'white'
              }}
            />
          </div>
        </Col>
      </Row>

      <Row gutter={[24, 24]}>
        {/* Class Info Card */}
        <Col xs={24} lg={12}>
          <Card
            className="bg-white dark:bg-[#101010] border-slate-200 dark:border-slate-800"
            title={
              <Title level={4} className="!mb-0 text-slate-900 dark:text-white">
                Sinf haqida ma'lumot
              </Title>
            }
          >
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <User size={20} className="text-slate-500" />
                <div>
                  <Text strong className="text-slate-900 dark:text-white">
                    Sinf rahbari:
                  </Text>{' '}
                  <Text className="text-slate-600 dark:text-slate-400">
                    {getTeacherName(classData.teacher)}
                  </Text>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar size={20} className="text-slate-500" />
                <div>
                  <Text strong className="text-slate-900 dark:text-white">
                    Dars jadvali:
                  </Text>{' '}
                  <Text className="text-slate-600 dark:text-slate-400">
                    {classData.schedule || 'Belgilanmagan'}
                  </Text>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Users size={20} className="text-slate-500" />
                <div>
                  <Text strong className="text-slate-900 dark:text-white">
                    O'quvchilar sig'imi:
                  </Text>{' '}
                  <Text className="text-slate-600 dark:text-slate-400">
                    {classData.studentsCount} / {classData.maxStudents}
                  </Text>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <GraduationCap size={20} className="text-slate-500" />
                <div>
                  <Text strong className="text-slate-900 dark:text-white">
                    Holat:
                  </Text>{' '}
                  <Tag color={classData.status === 'active' ? 'green' : 'red'}>
                    {classData.status === 'active' ? 'Faol' : 'Nofaol'}
                  </Tag>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Clock size={20} className="text-slate-500" />
                <div>
                  <Text strong className="text-slate-900 dark:text-white">
                    Yaratilgan sana:
                  </Text>{' '}
                  <Text className="text-slate-600 dark:text-slate-400">
                    {classData.createdDate}
                  </Text>
                </div>
              </div>
            </div>
          </Card>
        </Col>

        {/* Subject Mastery Card */}
        <Col xs={24} lg={12}>
          <Card
            className="bg-white dark:bg-[#101010] border-slate-200 dark:border-slate-800"
            title={
              <Title level={4} className="!mb-0 text-slate-900 dark:text-white">
                Fanlar bo'yicha o'zlashtirish darajasi
              </Title>
            }
          >
            <div className="space-y-4">
              {classData.subjects.length > 0 ? (
                classData.subjects.map((subjectId) => (
                  <div key={subjectId}>
                    <div className="flex justify-between items-center mb-1">
                      <Text className="text-slate-700 dark:text-slate-300">
                        {getSubjectName(subjectId)}
                      </Text>
                      <Text strong className="text-slate-900 dark:text-white">
                        {classData.subjectMastery[subjectId] || 0}%
                      </Text>
                    </div>
                    <Progress
                      percent={classData.subjectMastery[subjectId] || 0}
                      status={
                        (classData.subjectMastery[subjectId] || 0) >= 70
                          ? 'success'
                          : (classData.subjectMastery[subjectId] || 0) >= 40
                          ? 'normal'
                          : 'exception'
                      }
                      strokeColor={{
                        '0%': '#f59e0b', // orange
                        '50%': '#6bd281', // green
                        '100%': '#10b981' // darker green
                      }}
                      showInfo={false}
                    />
                  </div>
                ))
              ) : (
                <Text className="text-slate-600 dark:text-slate-400">
                  Fanlar biriktirilmagan.
                </Text>
              )}
            </div>
          </Card>
        </Col>
      </Row>

      {/* Questions by Subject Card */}
      <Card
        className="bg-white dark:bg-[#101010] border-slate-200 dark:border-slate-800"
        title={
          <Title level={4} className="!mb-0 text-slate-900 dark:text-white">
            Fanlar bo'yicha savollar statistikasi
          </Title>
        }
      >
        <Row gutter={[16, 16]}>
          {classData.subjects.length > 0 ? (
            classData.subjects.map((subjectId) => {
              const stats = getSubjectQuestionStats(subjectId);
              return (
                <Col xs={24} sm={12} md={8} key={subjectId}>
                  <Card
                    size="small"
                    className="bg-slate-50 dark:bg-[#000000] border-slate-200 dark:border-slate-700"
                  >
                    <Title
                      level={5}
                      className="!mb-2 text-slate-900 dark:text-white"
                    >
                      {getSubjectName(subjectId)} ({stats.total} ta savol)
                    </Title>
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400">
                        <span>Oson:</span>
                        <Tag color="green">{stats.easy}</Tag>
                      </div>
                      <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400">
                        <span>O'rta:</span>
                        <Tag color="orange">{stats.medium}</Tag>
                      </div>
                      <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400">
                        <span>Qiyin:</span>
                        <Tag color="red">{stats.hard}</Tag>
                      </div>
                    </div>
                    <Text className="text-xs text-slate-500 mt-2 block">
                      *Darajalar o'qituvchilar tomonidan kiritiladi.
                    </Text>
                  </Card>
                </Col>
              );
            })
          ) : (
            <Col span={24}>
              <Text className="text-slate-600 dark:text-slate-400">
                Bu sinfga fanlar biriktirilmagan.
              </Text>
            </Col>
          )}
        </Row>
      </Card>

      {/* Students Table */}
      <Card
        className="bg-white dark:bg-[#101010] border-slate-200 dark:border-slate-800"
        title={
          <div className="flex items-center justify-between">
            <Title level={4} className="!mb-0 text-slate-900 dark:text-white">
              Sinf o'quvchilari ({classStudents.length} ta)
            </Title>
            <Button
              type="primary"
              size="middle"
              icon={<Plus />}
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
            Bu sinfda o'quvchilar mavjud emas.
          </Text>
        )}
      </Card>

      {/* Add/Edit Student Modal */}
      <Modal
        title={
          editingStudent ? "O'quvchini tahrirlash" : "Yangi o'quvchi qo'shish"
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
          style: { backgroundColor: '#6bd281', border: 'none' }
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
