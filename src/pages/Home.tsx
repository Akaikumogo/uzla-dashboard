/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  Row,
  Col,
  Typography,
  Card,
  Statistic,
  Tag,
  Table,
  Progress,
  List,
  Avatar,
  Alert,
  Button,
  Empty
} from 'antd';
import {
  Users,
  BookOpen,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
  FileText,
  User,
  GraduationCap,
  AlertCircle,
  Plus,
  MessageSquare
} from 'lucide-react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title as ChartTitle,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import type { ColumnsType } from 'antd/es/table';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ChartTitle,
  Tooltip,
  Legend,
  ArcElement
);

const { Title, Text } = Typography;

// Mock data types
export type TeacherDto = {
  id: string;
  fullName: string;
  subject: string;
  subjectId: string;
  assignedClass?: {
    id: string;
    name: string;
    grade: number;
    studentsCount: number;
  };
};

export type QuestionStatsDto = {
  level: number;
  subjects: {
    subjectId: string;
    subjectName: string;
    count: number;
    answeredCount: number;
    pendingCount: number;
    acceptedCount: number;
    rejectedCount: number;
  }[];
};

export type RecentActivityDto = {
  id: string;
  type: 'question_created' | 'answer_received' | 'answer_graded';
  description: string;
  time: string;
  studentName?: string;
};

// SCENARIO 1: O'qituvchi faqat sinfga ega (savollar yo'q)
// const teacherWithClassOnly: TeacherDto = {
//   id: 'teacher-bio-001',
//   fullName: 'Dr. Malika Tosheva',
//   subject: 'Biologiya',
//   subjectId: '4',
//   assignedClass: {
//     id: 'class-002',
//     name: '10-B sinf',
//     grade: 10,
//     studentsCount: 25
//   }
// };

// SCENARIO 2: O'qituvchi faqat savollarga ega (sinf yo'q)
// const teacherWithQuestionsOnly: TeacherDto = {
//   id: 'teacher-bio-002',
//   fullName: 'Dr. Aziza Rahimova',
//   subject: 'Biologiya',
//   subjectId: '4'
//   // assignedClass: undefined
// };

// SCENARIO 3: O'qituvchi ham sinfga ham savollarga ega
const teacherWithBoth: TeacherDto = {
  id: 'teacher-bio-003',
  fullName: 'Dr. Nodira Karimova',
  subject: 'Biologiya',
  subjectId: '4',
  assignedClass: {
    id: 'class-003',
    name: '11-A sinf',
    grade: 11,
    studentsCount: 22
  }
};

// Current teacher - bu yerda scenario'ni o'zgartirib test qilish mumkin
const currentTeacher = teacherWithBoth; // teacherWithClassOnly, teacherWithQuestionsOnly, teacherWithBoth

// Mock subjects
// const mockSubjects = [
//   { id: '1', name: 'Matematika' },
//   { id: '2', name: 'Fizika' },
//   { id: '3', name: 'Kimyo' },
//   { id: '4', name: 'Biologiya' },
//   { id: '5', name: 'Tarix' }
// ];

// Mock question statistics - bu yerda currentTeacher ga qarab o'zgaradi
const generateQuestionStats = (teacher: TeacherDto): QuestionStatsDto[] => {
  // Agar o'qituvchi faqat sinfga ega bo'lsa, savollar yo'q
  if (teacher.id === 'teacher-bio-001') {
    return [];
  }

  // Agar o'qituvchi faqat savollarga ega bo'lsa yoki ikkalasiga ham ega bo'lsa
  return [
    {
      level: 1,
      subjects: [
        {
          subjectId: '4',
          subjectName: 'Biologiya',
          count: 15,
          answeredCount: 12,
          pendingCount: 3,
          acceptedCount: 8,
          rejectedCount: 1
        },
        {
          subjectId: '3',
          subjectName: 'Kimyo',
          count: 8,
          answeredCount: 6,
          pendingCount: 2,
          acceptedCount: 4,
          rejectedCount: 0
        },
        {
          subjectId: '2',
          subjectName: 'Fizika',
          count: 5,
          answeredCount: 4,
          pendingCount: 1,
          acceptedCount: 3,
          rejectedCount: 0
        }
      ]
    },
    {
      level: 2,
      subjects: [
        {
          subjectId: '4',
          subjectName: 'Biologiya',
          count: 20,
          answeredCount: 18,
          pendingCount: 5,
          acceptedCount: 10,
          rejectedCount: 3
        },
        {
          subjectId: '3',
          subjectName: 'Kimyo',
          count: 12,
          answeredCount: 10,
          pendingCount: 3,
          acceptedCount: 6,
          rejectedCount: 1
        },
        {
          subjectId: '1',
          subjectName: 'Matematika',
          count: 6,
          answeredCount: 5,
          pendingCount: 1,
          acceptedCount: 4,
          rejectedCount: 0
        }
      ]
    },
    {
      level: 3,
      subjects: [
        {
          subjectId: '4',
          subjectName: 'Biologiya',
          count: 25,
          answeredCount: 20,
          pendingCount: 8,
          acceptedCount: 10,
          rejectedCount: 2
        },
        {
          subjectId: '3',
          subjectName: 'Kimyo',
          count: 15,
          answeredCount: 12,
          pendingCount: 4,
          acceptedCount: 7,
          rejectedCount: 1
        },
        {
          subjectId: '2',
          subjectName: 'Fizika',
          count: 10,
          answeredCount: 8,
          pendingCount: 2,
          acceptedCount: 5,
          rejectedCount: 1
        }
      ]
    },
    {
      level: 4,
      subjects: [
        {
          subjectId: '4',
          subjectName: 'Biologiya',
          count: 18,
          answeredCount: 15,
          pendingCount: 6,
          acceptedCount: 8,
          rejectedCount: 1
        },
        {
          subjectId: '3',
          subjectName: 'Kimyo',
          count: 10,
          answeredCount: 8,
          pendingCount: 3,
          acceptedCount: 4,
          rejectedCount: 1
        },
        {
          subjectId: '1',
          subjectName: 'Matematika',
          count: 8,
          answeredCount: 6,
          pendingCount: 2,
          acceptedCount: 4,
          rejectedCount: 0
        }
      ]
    },
    {
      level: 5,
      subjects: [
        {
          subjectId: '4',
          subjectName: 'Biologiya',
          count: 12,
          answeredCount: 10,
          pendingCount: 4,
          acceptedCount: 5,
          rejectedCount: 1
        },
        {
          subjectId: '3',
          subjectName: 'Kimyo',
          count: 8,
          answeredCount: 6,
          pendingCount: 2,
          acceptedCount: 3,
          rejectedCount: 1
        },
        {
          subjectId: '2',
          subjectName: 'Fizika',
          count: 5,
          answeredCount: 4,
          pendingCount: 1,
          acceptedCount: 3,
          rejectedCount: 0
        }
      ]
    }
  ];
};

const mockQuestionStats = generateQuestionStats(currentTeacher);

// Mock recent activities - teacher ga qarab o'zgaradi
const generateRecentActivities = (teacher: TeacherDto): RecentActivityDto[] => {
  const baseActivities: RecentActivityDto[] = [];

  // Agar sinf bor bo'lsa, sinf bilan bog'liq faoliyatlar
  if (teacher.assignedClass) {
    baseActivities.push(
      {
        id: 'act-class-001',
        type: 'answer_received',
        description: "Yangi javob olindi: 'Hujayra membranasi' savoliga",
        time: '5 daqiqa oldin',
        studentName: 'Ali Valiyev'
      },
      {
        id: 'act-class-002',
        type: 'answer_graded',
        description: 'Javob baholandi: 85 ball berildi',
        time: '2 soat oldin',
        studentName: 'Gulnoza Karimova'
      }
    );
  }

  // Agar savollar bor bo'lsa, savol bilan bog'liq faoliyatlar
  if (mockQuestionStats.length > 0) {
    baseActivities.push(
      {
        id: 'act-question-001',
        type: 'question_created',
        description: "Yangi savol yaratildi: 'Fotosintez jarayoni'",
        time: '1 soat oldin'
      },
      {
        id: 'act-question-002',
        type: 'answer_received',
        description: "Yangi javob olindi: 'Genetika asoslari' savoliga",
        time: '3 soat oldin',
        studentName: teacher.assignedClass
          ? 'Davron Saidov'
          : "Noma'lum o'quvchi"
      }
    );
  }

  // Agar hech narsa yo'q bo'lsa
  if (!teacher.assignedClass && mockQuestionStats.length === 0) {
    baseActivities.push({
      id: 'act-empty-001',
      type: 'question_created',
      description: "Hozircha faoliyat yo'q",
      time: 'Hech qachon'
    });
  }

  return baseActivities;
};

const mockRecentActivities = generateRecentActivities(currentTeacher);

// Mock top students - faqat sinf bor bo'lganda
const mockTopStudents = currentTeacher.assignedClass
  ? [
      { id: '1', name: 'Gulnoza Karimova', score: 94, answersCount: 15 },
      { id: '2', name: 'Ali Valiyev', score: 88, answersCount: 12 },
      { id: '3', name: 'Zarina Alimova', score: 85, answersCount: 10 },
      { id: '4', name: 'Davron Saidov', score: 82, answersCount: 8 },
      { id: '5', name: 'Farhod Olimov', score: 79, answersCount: 9 }
    ]
  : [];

// Available classes for assignment
const availableClasses = [
  { id: 'class-001', name: '9-A sinf', grade: 9, studentsCount: 28 },
  { id: 'class-002', name: '10-B sinf', grade: 10, studentsCount: 25 },
  { id: 'class-003', name: '11-A sinf', grade: 11, studentsCount: 22 }
];

export default function TeacherDashboard() {


  // Check what teacher has
  const hasClass = !!currentTeacher.assignedClass;
  const hasQuestions =
    mockQuestionStats.length > 0 &&
    mockQuestionStats.some((level) =>
      level.subjects.some((subject) => subject.count > 0)
    );

  // Calculate overall statistics
  const calculateOverallStats = () => {
    let totalQuestions = 0;
    let totalAnswered = 0;
    let totalPending = 0;
    let totalAccepted = 0;
    let totalRejected = 0;

    mockQuestionStats.forEach((levelStats) => {
      levelStats.subjects.forEach((subject) => {
        totalQuestions += subject.count;
        totalAnswered += subject.answeredCount;
        totalPending += subject.pendingCount;
        totalAccepted += subject.acceptedCount;
        totalRejected += subject.rejectedCount;
      });
    });

    return {
      totalQuestions,
      totalAnswered,
      totalPending,
      totalAccepted,
      totalRejected
    };
  };

  const overallStats = calculateOverallStats();

  // Generate chart data for each level
  const generateChartData = (levelStats: QuestionStatsDto) => {
    const labels = levelStats.subjects.map((s) => s.subjectName);
    const data = levelStats.subjects.map((s) => s.count);
    const answeredData = levelStats.subjects.map((s) => s.answeredCount);

    return {
      labels,
      datasets: [
        {
          label: 'Jami savollar',
          data: data,
          backgroundColor: [
            '#6bd281',
            '#3b82f6',
            '#f59e0b',
            '#ef4444',
            '#8b5cf6'
          ],
          borderWidth: 0
        },
        {
          label: 'Javob berilgan',
          data: answeredData,
          backgroundColor: [
            '#10b981',
            '#1d4ed8',
            '#d97706',
            '#dc2626',
            '#7c3aed'
          ],
          borderWidth: 0
        }
      ]
    };
  };

  // Chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          usePointStyle: true,
          padding: 15
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1
        }
      }
    }
  };

  // Top students table columns
  const topStudentsColumns: ColumnsType<any> = [
    {
      title: "O'rin",
      render: (_, __, index) => (
        <div className="flex items-center justify-center">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
              index === 0
                ? 'bg-yellow-500'
                : index === 1
                ? 'bg-gray-400'
                : index === 2
                ? 'bg-orange-600'
                : 'bg-slate-400'
            }`}
          >
            {index + 1}
          </div>
        </div>
      ),
      width: 80
    },
    {
      title: "O'quvchi",
      dataIndex: 'name',
      key: 'name',
      render: (name: string) => (
        <div className="flex items-center gap-2">
          <User size={16} className="text-slate-400" />
          <Text className="font-medium text-slate-900 dark:text-white">
            {name}
          </Text>
        </div>
      )
    },
    {
      title: "O'rtacha ball",
      dataIndex: 'score',
      key: 'score',
      render: (score: number) => (
        <Tag color={score >= 90 ? 'green' : score >= 80 ? 'blue' : 'orange'}>
          {score}
        </Tag>
      )
    },
    {
      title: 'Javoblar soni',
      dataIndex: 'answersCount',
      key: 'answersCount',
      render: (count: number) => (
        <Text className="text-slate-600 dark:text-slate-400">{count} ta</Text>
      )
    }
  ];

  return (
    <div className="p-6 space-y-6 min-h-full bg-slate-50 dark:bg-[#0f0f0f]">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <Title level={2} className="!mb-2 text-slate-900 dark:text-white">
            Xush kelibsiz, {currentTeacher.fullName}!
          </Title>
          <Text className="text-slate-600 dark:text-slate-400">
            {currentTeacher.subject} o'qituvchisi •{' '}
            {currentTeacher.assignedClass?.name || 'Sinf tayinlanmagan'}
          </Text>
        </div>
      </div>

      {/* Status Alerts */}
      <div className="space-y-4">
        {!hasClass && !hasQuestions && (
          <Alert
            message="Hech narsa tayinlanmagan"
            description="Sizga hali sinf ham, savollar ham tayinlanmagan. Administrator bilan bog'laning."
            type="error"
            icon={<AlertCircle />}
            showIcon
          />
        )}

        {!hasClass && hasQuestions && (
          <Alert
            message="Sinf tayinlanmagan"
            description="Sizga sinf tayinlanmagan, lekin savollaringiz mavjud. To'liq funksionallik uchun sinf tayinlang."
            type="warning"
            icon={<AlertCircle />}
            action={
              <Button type="primary"  icon={<Plus />}>
                Sinf tanlash
              </Button>
            }
            showIcon
          />
        )}

        {hasClass && !hasQuestions && (
          <Alert
            message="Savollar mavjud emas"
            description="Sizga sinf tayinlangan, lekin hali savollar yaratilmagan. Savollar yaratishni boshlang."
            type="info"
            icon={<MessageSquare />}
            action={
              <Button type="primary"  icon={<Plus />}>
                Savol yaratish
              </Button>
            }
            showIcon
          />
        )}
      </div>

      {/* Overall Statistics - faqat savollar bor bo'lganda */}
      {hasQuestions && (
        <Row gutter={[24, 24]}>
          <Col xs={24} sm={8} lg={hasClass ? 4 : 5}>
            <div className="bg-gradient-to-br p-4 rounded-lg from-blue-400 to-blue-600 border-0">
              <Statistic
                title={<span className="text-white">Jami Savollar</span>}
                value={overallStats.totalQuestions}
                prefix={<FileText className="text-white" />}
                valueStyle={{
                  fontSize: '2rem',
                  fontWeight: 'bold',
                  color: 'white'
                }}
              />
            </div>
          </Col>
          <Col xs={24} sm={8} lg={hasClass ? 4 : 5}>
            <div className="bg-gradient-to-br p-4 rounded-lg from-green-400 to-green-600 border-0">
              <Statistic
                title={<span className="text-white">Javob Berilgan</span>}
                value={overallStats.totalAnswered}
                prefix={<CheckCircle className="text-white" />}
                valueStyle={{
                  fontSize: '2rem',
                  fontWeight: 'bold',
                  color: 'white'
                }}
              />
            </div>
          </Col>
          <Col xs={24} sm={8} lg={hasClass ? 4 : 5}>
            <div className="bg-gradient-to-br p-4 rounded-lg from-orange-400 to-orange-600 border-0">
              <Statistic
                title={<span className="text-white">Kutilayotgan</span>}
                value={overallStats.totalPending}
                prefix={<Clock className="text-white" />}
                valueStyle={{
                  fontSize: '2rem',
                  fontWeight: 'bold',
                  color: 'white'
                }}
              />
            </div>
          </Col>
          <Col xs={24} sm={8} lg={hasClass ? 4 : 5}>
            <div className="bg-gradient-to-br p-4 rounded-lg from-emerald-400 to-emerald-600 border-0">
              <Statistic
                title={<span className="text-white">Qabul Qilingan</span>}
                value={overallStats.totalAccepted}
                prefix={<CheckCircle className="text-white" />}
                valueStyle={{
                  fontSize: '2rem',
                  fontWeight: 'bold',
                  color: 'white'
                }}
              />
            </div>
          </Col>
          <Col xs={24} sm={8} lg={hasClass ? 4 : 5}>
            <div className="bg-gradient-to-br p-4 rounded-lg from-red-400 to-red-600 border-0">
              <Statistic
                title={<span className="text-white">Rad Etilgan</span>}
                value={overallStats.totalRejected}
                prefix={<XCircle className="text-white" />}
                valueStyle={{
                  fontSize: '2rem',
                  fontWeight: 'bold',
                  color: 'white'
                }}
              />
            </div>
          </Col>
          {hasClass && (
            <Col xs={24} sm={8} lg={4}>
              <div className="bg-gradient-to-br p-4 rounded-lg from-purple-400 to-purple-600 border-0">
                <Statistic
                  title={<span className="text-white">Mening Sinfim</span>}
                  value={currentTeacher.assignedClass!.studentsCount}
                  prefix={<Users className="text-white" />}
                  suffix={<span className="text-white text-sm">o'quvchi</span>}
                  valueStyle={{
                    fontSize: '2rem',
                    fontWeight: 'bold',
                    color: 'white'
                  }}
                />
              </div>
            </Col>
          )}
        </Row>
      )}

      {/* Class Info - faqat sinf bor bo'lganda */}
      {hasClass && (
        <Card
          className="bg-white dark:bg-[#101010] border-slate-200 dark:border-slate-800"
          title={
            <div className="flex items-center gap-2">
              <GraduationCap className="text-[#6bd281]" />
              <Title level={4} className="!mb-0 text-slate-900 dark:text-white">
                Mening Sinfim - {currentTeacher.assignedClass!.name}
              </Title>
            </div>
          }
        >
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={8}>
              <Statistic
                title="O'quvchilar soni"
                value={currentTeacher.assignedClass!.studentsCount}
                prefix={<Users className="text-[#6bd281]" />}
              />
            </Col>
            <Col xs={24} sm={8}>
              <Statistic
                title="Sinf darajasi"
                value={currentTeacher.assignedClass!.grade}
                suffix="-sinf"
                prefix={<BookOpen className="text-[#6bd281]" />}
              />
            </Col>
            <Col xs={24} sm={8}>
              <div>
                <Text strong className="text-slate-900 dark:text-white">
                  Faollik darajasi
                </Text>
                <Progress percent={85} strokeColor="#6bd281" className="mt-2" />
                <Text className="text-sm text-slate-500">Yaxshi natija</Text>
              </div>
            </Col>
          </Row>
        </Card>
      )}

      {/* No Class - Show Available Classes */}
      {!hasClass && (
        <Card
          className="bg-white dark:bg-[#101010] border-slate-200 dark:border-slate-800"
          title={
            <div className="flex items-center gap-2">
              <Users className="text-orange-500" />
              <Title level={4} className="!mb-0 text-slate-900 dark:text-white">
                Mavjud sinflar
              </Title>
            </div>
          }
        >
          <div className="text-center py-8">
            <AlertCircle size={48} className="text-orange-500 mx-auto mb-4" />
            <Title
              level={4}
              className="text-slate-600 dark:text-slate-400 mb-2"
            >
              Sizga sinf tayinlanmagan
            </Title>
            <Text className="text-slate-500 mb-6">
              To'liq dashboard funksiyalaridan foydalanish uchun sinf
              tayinlanishi kerak
            </Text>

            <Row gutter={[16, 16]} justify="center">
              {availableClasses.map((classItem) => (
                <Col xs={24} sm={8} key={classItem.id}>
                  <Card
                    
                    className="border-dashed border-slate-300 dark:border-slate-600 hover:border-[#6bd281] transition-colors cursor-pointer"
                    onClick={() => {
                      console.log(`Sinf tanlandi: ${classItem.name}`);
                    }}
                  >
                    <div className="text-center">
                      <GraduationCap
                        className="text-[#6bd281] mx-auto mb-2"
                        size={32}
                      />
                      <Title
                        level={5}
                        className="!mb-1 text-slate-900 dark:text-white"
                      >
                        {classItem.name}
                      </Title>
                      <Text className="text-slate-500">
                        {classItem.studentsCount} o'quvchi
                      </Text>
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>
          </div>
        </Card>
      )}

      {/* Question Statistics by Levels - faqat savollar bor bo'lganda */}
      {hasQuestions && (
        <div className="space-y-6">
          <Title level={3} className="text-slate-900 dark:text-white">
            Darajalar bo'yicha savollar statistikasi
            {!hasClass && (
              <Text className="text-sm text-slate-500 ml-2">
                (Faqat sizning fanlaringiz)
              </Text>
            )}
          </Title>
          <Row gutter={[24, 24]}>
            {mockQuestionStats.map((levelStats) => (
              <Col xs={24} lg={12} xl={8} key={levelStats.level}>
                <Card
                  className="bg-white dark:bg-[#101010] border-slate-200 dark:border-slate-800"
                  title={
                    <div className="flex items-center justify-between">
                      <Title
                        level={5}
                        className="!mb-0 text-slate-900 dark:text-white"
                      >
                        {levelStats.level}-daraja savollar
                      </Title>
                      <Tag color="blue">
                        {levelStats.subjects.reduce(
                          (sum, s) => sum + s.count,
                          0
                        )}{' '}
                        ta
                      </Tag>
                    </div>
                  }
                >
                  <div style={{ height: '300px' }}>
                    <Bar
                      data={generateChartData(levelStats)}
                      options={chartOptions}
                    />
                  </div>
                  <div className="mt-4 space-y-2">
                    {levelStats.subjects.map((subject) => (
                      <div
                        key={subject.subjectId}
                        className="flex justify-between items-center text-sm"
                      >
                        <Text className="text-slate-600 dark:text-slate-400">
                          {subject.subjectName}:
                        </Text>
                        <div className="flex gap-2">
                          <Tag color="blue" >
                            {subject.count}
                          </Tag>
                          <Tag color="green" >
                            {subject.acceptedCount}
                          </Tag>
                          <Tag color="orange" >
                            {subject.pendingCount}
                          </Tag>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      )}

      {/* No Questions State */}
      {!hasQuestions && (
        <Card
          className="bg-white dark:bg-[#101010] border-slate-200 dark:border-slate-800"
          title={
            <div className="flex items-center gap-2">
              <MessageSquare className="text-blue-500" />
              <Title level={4} className="!mb-0 text-slate-900 dark:text-white">
                Savollar bo'limi
              </Title>
            </div>
          }
        >
          <Empty
            image={
              <MessageSquare size={64} className="text-slate-300 mx-auto" />
            }
            description={
              <div className="text-center">
                <Title level={4} className="text-slate-400 mb-2">
                  Hali savollar yaratilmagan
                </Title>
                <Text className="text-slate-500">
                  O'quvchilar uchun savollar yaratishni boshlang
                </Text>
              </div>
            }
          >
            <Button type="primary" icon={<Plus />}>
              Birinchi savolni yaratish
            </Button>
          </Empty>
        </Card>
      )}

      <Row gutter={[24, 24]}>
        {/* Top Students - faqat sinf bor bo'lganda */}
        {hasClass && (
          <Col xs={24} lg={hasQuestions ? 12 : 24}>
            <Card
              className="bg-white dark:bg-[#101010] border-slate-200 dark:border-slate-800"
              title={
                <div className="flex items-center gap-2">
                  <TrendingUp className="text-[#6bd281]" />
                  <Title
                    level={4}
                    className="!mb-0 text-slate-900 dark:text-white"
                  >
                    Eng faol o'quvchilar
                  </Title>
                </div>
              }
            >
              <Table
                columns={topStudentsColumns}
                dataSource={mockTopStudents}
                rowKey="id"
                pagination={false}
                
              />
            </Card>
          </Col>
        )}

        {/* No Students Info - sinf yo'q bo'lganda */}
        {!hasClass && hasQuestions && (
          <Col xs={24} lg={12}>
            <Card
              className="bg-white dark:bg-[#101010] border-slate-200 dark:border-slate-800"
              title={
                <div className="flex items-center gap-2">
                  <Users className="text-orange-500" />
                  <Title
                    level={4}
                    className="!mb-0 text-slate-900 dark:text-white"
                  >
                    O'quvchilar ma'lumoti
                  </Title>
                </div>
              }
            >
              <div className="text-center py-8">
                <Users size={48} className="text-slate-300 mx-auto mb-4" />
                <Title level={5} className="text-slate-400 mb-2">
                  O'quvchilar ma'lumoti mavjud emas
                </Title>
                <Text className="text-slate-500">
                  Sinf tayinlangandan so'ng o'quvchilar statistikasini
                  ko'rishingiz mumkin
                </Text>
              </div>
            </Card>
          </Col>
        )}

        {/* Recent Activities */}
        <Col
          xs={24}
          lg={
            hasClass && hasQuestions ? 12 : hasClass || hasQuestions ? 12 : 24
          }
        >
          <Card
            className="bg-white dark:bg-[#101010] border-slate-200 dark:border-slate-800"
            title={
              <div className="flex items-center gap-2">
                <Clock className="text-[#6bd281]" />
                <Title
                  level={4}
                  className="!mb-0 text-slate-900 dark:text-white"
                >
                  So'nggi faoliyat
                </Title>
              </div>
            }
          >
            {mockRecentActivities.length > 0 &&
            mockRecentActivities[0].id !== 'act-empty-001' ? (
              <List
                dataSource={mockRecentActivities}
                renderItem={(item) => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={
                        <Avatar
                          style={{
                            backgroundColor:
                              item.type === 'answer_received'
                                ? '#6bd281'
                                : item.type === 'question_created'
                                ? '#3b82f6'
                                : '#f59e0b'
                          }}
                          icon={
                            item.type === 'answer_received' ? (
                              <FileText size={16} />
                            ) : item.type === 'question_created' ? (
                              <BookOpen size={16} />
                            ) : (
                              <CheckCircle size={16} />
                            )
                          }
                        />
                      }
                      title={
                        <div>
                          <Text className="text-slate-900 dark:text-white">
                            {item.description}
                          </Text>
                          {item.studentName &&
                            item.studentName !== "Noma'lum o'quvchi" && (
                              <Tag color="blue"  className="ml-2">
                                {item.studentName}
                              </Tag>
                            )}
                        </div>
                      }
                      description={
                        <Text className="text-slate-500 text-sm">
                          {item.time}
                        </Text>
                      }
                    />
                  </List.Item>
                )}
              />
            ) : (
              <div className="text-center py-8">
                <Clock size={48} className="text-slate-300 mx-auto mb-4" />
                <Title level={5} className="text-slate-400 mb-2">
                  Hozircha faoliyat yo'q
                </Title>
                <Text className="text-slate-500">
                  Savollar yaratib, sinf tayinlangandan so'ng faoliyat ko'rinadi
                </Text>
              </div>
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
}
