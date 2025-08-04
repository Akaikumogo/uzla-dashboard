'use client';

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
  TeamOutlined,
  BookOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
  TrophyOutlined,
  FileTextOutlined,
  UserOutlined,
  ExperimentOutlined,
  ExclamationCircleOutlined,
  PlusOutlined,
  MessageOutlined,
  BugOutlined,
  EyeOutlined
} from '@ant-design/icons';
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
import type { ColumnsType } from 'antd/es/table'; // Import ColumnsType

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

// Biology teacher with both class and questions
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

// Current teacher
const currentTeacher = teacherWithBoth;

// Biology-specific question statistics
const generateBiologyQuestionStats = (
  teacher: TeacherDto
): QuestionStatsDto[] => {
  if (teacher.id === 'teacher-bio-001') {
    return [];
  }

  return [
    {
      level: 1,
      subjects: [
        {
          subjectId: '4',
          subjectName: 'Hujayra biologiyasi',
          count: 18,
          answeredCount: 15,
          pendingCount: 3,
          acceptedCount: 12,
          rejectedCount: 1
        },
        {
          subjectId: '4-1',
          subjectName: 'Organizmlar xilma-xilligi',
          count: 12,
          answeredCount: 10,
          pendingCount: 2,
          acceptedCount: 8,
          rejectedCount: 0
        },
        {
          subjectId: '4-2',
          subjectName: 'Fiziologiya asoslari',
          count: 8,
          answeredCount: 6,
          pendingCount: 2,
          acceptedCount: 4,
          rejectedCount: 0
        }
      ]
    },
    {
      level: 2,
      subjects: [
        {
          subjectId: '4',
          subjectName: 'Genetika va irsiyat',
          count: 25,
          answeredCount: 22,
          pendingCount: 5,
          acceptedCount: 15,
          rejectedCount: 2
        },
        {
          subjectId: '4-1',
          subjectName: 'Evolyutsiya nazariyasi',
          count: 16,
          answeredCount: 13,
          pendingCount: 3,
          acceptedCount: 9,
          rejectedCount: 1
        },
        {
          subjectId: '4-2',
          subjectName: 'Ekologiya',
          count: 10,
          answeredCount: 8,
          pendingCount: 2,
          acceptedCount: 6,
          rejectedCount: 0
        }
      ]
    },
    {
      level: 3,
      subjects: [
        {
          subjectId: '4',
          subjectName: 'Molekulyar biologiya',
          count: 30,
          answeredCount: 25,
          pendingCount: 8,
          acceptedCount: 15,
          rejectedCount: 2
        },
        {
          subjectId: '4-1',
          subjectName: 'Biotexnologiya',
          count: 20,
          answeredCount: 16,
          pendingCount: 4,
          acceptedCount: 11,
          rejectedCount: 1
        },
        {
          subjectId: '4-2',
          subjectName: 'Anatomiya va fiziologiya',
          count: 14,
          answeredCount: 11,
          pendingCount: 3,
          acceptedCount: 7,
          rejectedCount: 1
        }
      ]
    },
    {
      level: 4,
      subjects: [
        {
          subjectId: '4',
          subjectName: 'Biokimyo',
          count: 22,
          answeredCount: 18,
          pendingCount: 6,
          acceptedCount: 10,
          rejectedCount: 2
        },
        {
          subjectId: '4-1',
          subjectName: 'Mikrobiologiya',
          count: 15,
          answeredCount: 12,
          pendingCount: 3,
          acceptedCount: 8,
          rejectedCount: 1
        },
        {
          subjectId: '4-2',
          subjectName: 'Immunologiya',
          count: 12,
          answeredCount: 9,
          pendingCount: 3,
          acceptedCount: 6,
          rejectedCount: 0
        }
      ]
    },
    {
      level: 5,
      subjects: [
        {
          subjectId: '4',
          subjectName: 'Tibbiy biologiya',
          count: 18,
          answeredCount: 15,
          pendingCount: 5,
          acceptedCount: 8,
          rejectedCount: 2
        },
        {
          subjectId: '4-1',
          subjectName: 'Bioinformatika',
          count: 10,
          answeredCount: 8,
          pendingCount: 2,
          acceptedCount: 5,
          rejectedCount: 1
        },
        {
          subjectId: '4-2',
          subjectName: 'Neyrofiziologiya',
          count: 8,
          answeredCount: 6,
          pendingCount: 2,
          acceptedCount: 4,
          rejectedCount: 0
        }
      ]
    }
  ];
};

const mockQuestionStats = generateBiologyQuestionStats(currentTeacher);

// Biology-specific recent activities
const generateBiologyActivities = (
  teacher: TeacherDto
): RecentActivityDto[] => {
  const baseActivities: RecentActivityDto[] = [];

  if (teacher.assignedClass) {
    baseActivities.push(
      {
        id: 'act-class-001',
        type: 'answer_received',
        description:
          "Yangi javob olindi: 'Fotosintez jarayonining yorug'lik fazasi' savoliga",
        time: '5 daqiqa oldin',
        studentName: 'Ali Valiyev'
      },
      {
        id: 'act-class-002',
        type: 'answer_graded',
        description: 'Javob baholandi: Mitoz jarayoni haqida - 88 ball berildi',
        time: '2 soat oldin',
        studentName: 'Gulnoza Karimova'
      }
    );
  }

  if (mockQuestionStats.length > 0) {
    baseActivities.push(
      {
        id: 'act-question-001',
        type: 'question_created',
        description: "Yangi savol yaratildi: 'DNK replikatsiyasi jarayoni'",
        time: '1 soat oldin'
      },
      {
        id: 'act-question-002',
        type: 'answer_received',
        description:
          "Yangi javob olindi: 'Hujayra membranasi tuzilishi' savoliga",
        time: '3 soat oldin',
        studentName: teacher.assignedClass
          ? 'Davron Saidov'
          : "Noma'lum o'quvchi"
      }
    );
  }

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

const mockRecentActivities = generateBiologyActivities(currentTeacher);

// Biology-focused top students
const mockTopStudents = currentTeacher.assignedClass
  ? [
      {
        id: '1',
        name: 'Gulnoza Karimova',
        score: 94,
        answersCount: 15,
        specialty: 'Genetika'
      },
      {
        id: '2',
        name: 'Ali Valiyev',
        score: 88,
        answersCount: 12,
        specialty: 'Fiziologiya'
      },
      {
        id: '3',
        name: 'Zarina Alimova',
        score: 85,
        answersCount: 10,
        specialty: 'Ekologiya'
      },
      {
        id: '4',
        name: 'Davron Saidov',
        score: 82,
        answersCount: 8,
        specialty: 'Anatomiya'
      },
      {
        id: '5',
        name: 'Farhod Olimov',
        score: 79,
        answersCount: 9,
        specialty: 'Botanika'
      }
    ]
  : [];

// Available biology classes
const availableClasses = [
  {
    id: 'class-001',
    name: '9-A sinf',
    grade: 9,
    studentsCount: 28,
    focus: 'Umumiy biologiya'
  },
  {
    id: 'class-002',
    name: '10-B sinf',
    grade: 10,
    studentsCount: 25,
    focus: 'Genetika va evolyutsiya'
  },
  {
    id: 'class-003',
    name: '11-A sinf',
    grade: 11,
    studentsCount: 22,
    focus: 'Molekulyar biologiya'
  }
];

export default function BiologyTeacherDashboard() {
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
            '#52c41a',
            '#1890ff',
            '#faad14',
            '#f5222d',
            '#722ed1'
          ],
          borderWidth: 0
        },
        {
          label: 'Javob berilgan',
          data: answeredData,
          backgroundColor: [
            '#389e0d',
            '#096dd9',
            '#d48806',
            '#cf1322',
            '#531dab'
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
      render: (name: string, record: any) => (
        <div className="flex items-center gap-2">
          <UserOutlined className="text-slate-400" />
          <div>
            <Text className="font-medium text-slate-900 dark:text-white">
              {name}
            </Text>
            <br />
            <Text className="text-xs text-slate-500">{record.specialty}</Text>
          </div>
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
            <BugOutlined className="mr-2" />
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
            description="Sizga hali sinf ham, biologiya savollari ham tayinlanmagan. Administrator bilan bog'laning."
            type="error"
            icon={<ExclamationCircleOutlined />}
            showIcon
          />
        )}

        {!hasClass && hasQuestions && (
          <Alert
            message="Sinf tayinlanmagan"
            description="Sizga sinf tayinlanmagan, lekin biologiya savollaringiz mavjud. To'liq funksionallik uchun sinf tayinlang."
            type="warning"
            icon={<ExclamationCircleOutlined />}
            action={
              <Button type="primary" icon={<PlusOutlined />}>
                Sinf tanlash
              </Button>
            }
            showIcon
          />
        )}

        {hasClass && !hasQuestions && (
          <Alert
            message="Biologiya savollari mavjud emas"
            description="Sizga sinf tayinlangan, lekin hali biologiya savollari yaratilmagan. Savollar yaratishni boshlang."
            type="info"
            icon={<MessageOutlined />}
            action={
              <Button type="primary" icon={<PlusOutlined />}>
                Biologiya savoli yaratish
              </Button>
            }
            showIcon
          />
        )}
      </div>

      {/* Overall Statistics - faqat savollar bor bo'lganda */}
      {hasQuestions && (
        <Row gutter={[24, 25]}>
          <Col xs={25} sm={8} lg={4}>
            <div className="bg-gradient-to-br p-4 rounded-lg from-blue-400 to-blue-600 border-0">
              <Statistic
                title={
                  <span className="text-white">Jami Biologiya Savollari</span>
                }
                value={overallStats.totalQuestions}
                prefix={<FileTextOutlined className="text-white" />}
                valueStyle={{
                  fontSize: '2rem',
                  fontWeight: 'bold',
                  color: 'white'
                }}
              />
            </div>
          </Col>
          <Col xs={25} sm={8} lg={5}>
            <div className="bg-gradient-to-br p-4 rounded-lg from-green-400 to-green-600 border-0">
              <Statistic
                title={<span className="text-white">Javob Berilgan</span>}
                value={overallStats.totalAnswered}
                prefix={<CheckCircleOutlined className="text-white" />}
                valueStyle={{
                  fontSize: '2rem',
                  fontWeight: 'bold',
                  color: 'white'
                }}
              />
            </div>
          </Col>
          <Col xs={25} sm={8} lg={4}>
            <div className="bg-gradient-to-br p-4 rounded-lg from-orange-400 to-orange-600 border-0">
              <Statistic
                title={<span className="text-white">Kutilayotgan</span>}
                value={overallStats.totalPending}
                prefix={<ClockCircleOutlined className="text-white" />}
                valueStyle={{
                  fontSize: '2rem',
                  fontWeight: 'bold',
                  color: 'white'
                }}
              />
            </div>
          </Col>
          <Col xs={25} sm={8} lg={5}>
            <div className="bg-gradient-to-br p-4 rounded-lg from-emerald-400 to-emerald-600 border-0">
              <Statistic
                title={<span className="text-white">Qabul Qilingan</span>}
                value={overallStats.totalAccepted}
                prefix={<CheckCircleOutlined className="text-white" />}
                valueStyle={{
                  fontSize: '2rem',
                  fontWeight: 'bold',
                  color: 'white'
                }}
              />
            </div>
          </Col>
          <Col xs={25} sm={8} lg={4}>
            <div className="bg-gradient-to-br p-4 rounded-lg from-red-400 to-red-600 border-0">
              <Statistic
                title={<span className="text-white">Rad Etilgan</span>}
                value={overallStats.totalRejected}
                prefix={<CloseCircleOutlined className="text-white" />}
                valueStyle={{
                  fontSize: '2rem',
                  fontWeight: 'bold',
                  color: 'white'
                }}
              />
            </div>
          </Col>
          {/* {hasClass && (
            <Col xs={24} sm={8} lg={4}>
              <div className="bg-gradient-to-br p-4 rounded-lg from-purple-400 to-purple-600 border-0">
                <Statistic
                  title={
                    <span className="text-white">Mening Biologiya Sinfim</span>
                  }
                  value={currentTeacher.assignedClass!.studentsCount}
                  prefix={<TeamOutlined className="text-white" />}
                  suffix={<span className="text-white text-sm">o'quvchi</span>}
                  valueStyle={{
                    fontSize: '2rem',
                    fontWeight: 'bold',
                    color: 'white'
                  }}
                />
              </div>
            </Col>
          )} */}
        </Row>
      )}

      {/* Class Info - faqat sinf bor bo'lganda */}
      {/* {hasClass && (
        <Card
          className="bg-white dark:bg-[#101010] border-slate-200 dark:border-slate-800"
          title={
            <div className="flex items-center gap-2">
              <ExperimentOutlined className="text-[#52c41a]" />
              <Title level={4} className="!mb-0 text-slate-900 dark:text-white">
                Mening Biologiya Sinfim - {currentTeacher.assignedClass!.name}
              </Title>
            </div>
          }
        >
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={8}>
              <Statistic
                title="O'quvchilar soni"
                value={currentTeacher.assignedClass!.studentsCount}
                prefix={<TeamOutlined className="text-[#52c41a]" />}
              />
            </Col>
            <Col xs={24} sm={8}>
              <Statistic
                title="Sinf darajasi"
                value={currentTeacher.assignedClass!.grade}
                suffix="-sinf"
                prefix={<BookOutlined className="text-[#52c41a]" />}
              />
            </Col>
            <Col xs={24} sm={8}>
              <div>
                <Text strong className="text-slate-900 dark:text-white">
                  Biologiya faniga qiziqish darajasi
                </Text>
                <Progress percent={92} strokeColor="#52c41a" className="mt-2" />
                <Text className="text-sm text-slate-500">A'lo natija</Text>
              </div>
            </Col>
          </Row>
        </Card>
      )} */}

      {/* No Class - Show Available Biology Classes */}
      {!hasClass && (
        <Card
          className="bg-white dark:bg-[#101010] border-slate-200 dark:border-slate-800"
          title={
            <div className="flex items-center gap-2">
              <TeamOutlined className="text-orange-500" />
              <Title level={4} className="!mb-0 text-slate-900 dark:text-white">
                Mavjud biologiya sinflari
              </Title>
            </div>
          }
        >
          <div className="text-center py-8">
            <ExclamationCircleOutlined className="text-orange-500 text-5xl mb-4" />
            <Title
              level={4}
              className="text-slate-600 dark:text-slate-400 mb-2"
            >
              Sizga biologiya sinfi tayinlanmagan
            </Title>
            <Text className="text-slate-500 mb-6">
              To'liq dashboard funksiyalaridan foydalanish uchun biologiya sinfi
              tayinlanishi kerak
            </Text>
            <Row gutter={[16, 16]} justify="center">
              {availableClasses.map((classItem) => (
                <Col xs={24} sm={8} key={classItem.id}>
                  <Card
                    className="border-dashed border-slate-300 dark:border-slate-600 hover:border-[#52c41a] transition-colors cursor-pointer"
                    onClick={() => {
                      console.log(
                        `Biologiya sinfi tanlandi: ${classItem.name}`
                      );
                    }}
                  >
                    <div className="text-center">
                      <ExperimentOutlined className="text-[#52c41a] text-3xl mb-2" />
                      <Title
                        level={5}
                        className="!mb-1 text-slate-900 dark:text-white"
                      >
                        {classItem.name}
                      </Title>
                      <Text className="text-slate-500">
                        {classItem.studentsCount} o'quvchi
                      </Text>
                      <br />
                      <Text className="text-xs text-slate-400">
                        {classItem.focus}
                      </Text>
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>
          </div>
        </Card>
      )}

      {/* Biology Question Statistics by Levels */}
      {hasQuestions && (
        <div className="space-y-6">
          <Title level={3} className="text-slate-900 dark:text-white">
            <BugOutlined className="mr-2" />
            Biologiya darajalar bo'yicha savollar statistikasi
            {!hasClass && (
              <Text className="text-sm text-slate-500 ml-2">
                (Faqat biologiya yo'nalishlari)
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
                        <EyeOutlined className="mr-2" />
                        {levelStats.level}-daraja biologiya savollari
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
                          <Tag color="blue">{subject.count}</Tag>
                          <Tag color="green">{subject.acceptedCount}</Tag>
                          <Tag color="orange">{subject.pendingCount}</Tag>
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
              <MessageOutlined className="text-blue-500" />
              <Title level={4} className="!mb-0 text-slate-900 dark:text-white">
                Biologiya savollari bo'limi
              </Title>
            </div>
          }
        >
          <Empty
            image={<MessageOutlined className="text-slate-300 text-6xl" />}
            description={
              <div className="text-center">
                <Title level={4} className="text-slate-400 mb-2">
                  Hali biologiya savollari yaratilmagan
                </Title>
                <Text className="text-slate-500">
                  O'quvchilar uchun biologiya savollari yaratishni boshlang
                </Text>
              </div>
            }
          >
            <Button type="primary" icon={<PlusOutlined />}>
              Birinchi biologiya savolini yaratish
            </Button>
          </Empty>
        </Card>
      )}

      <Row gutter={[24, 24]}>
        {/* Top Biology Students */}
        {hasClass && (
          <Col xs={24} lg={hasQuestions ? 12 : 24}>
            <Card
              className="bg-white dark:bg-[#101010] border-slate-200 dark:border-slate-800"
              title={
                <div className="flex items-center gap-2">
                  <TrophyOutlined className="text-[#52c41a]" />
                  <Title
                    level={4}
                    className="!mb-0 text-slate-900 dark:text-white"
                  >
                    Eng faol biologiya o'quvchilari
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

        {/* No Students Info */}
        {!hasClass && hasQuestions && (
          <Col xs={24} lg={12}>
            <Card
              className="bg-white dark:bg-[#101010] border-slate-200 dark:border-slate-800"
              title={
                <div className="flex items-center gap-2">
                  <TeamOutlined className="text-orange-500" />
                  <Title
                    level={4}
                    className="!mb-0 text-slate-900 dark:text-white"
                  >
                    Biologiya o'quvchilari ma'lumoti
                  </Title>
                </div>
              }
            >
              <div className="text-center py-8">
                <TeamOutlined className="text-slate-300 text-5xl mb-4" />
                <Title level={5} className="text-slate-400 mb-2">
                  O'quvchilar ma'lumoti mavjud emas
                </Title>
                <Text className="text-slate-500">
                  Biologiya sinfi tayinlangandan so'ng o'quvchilar
                  statistikasini ko'rishingiz mumkin
                </Text>
              </div>
            </Card>
          </Col>
        )}

        {/* Recent Biology Activities */}
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
                <ClockCircleOutlined className="text-[#52c41a]" />
                <Title
                  level={4}
                  className="!mb-0 text-slate-900 dark:text-white"
                >
                  So'nggi biologiya faoliyati
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
                                ? '#52c41a'
                                : item.type === 'question_created'
                                ? '#1890ff'
                                : '#faad14'
                          }}
                          icon={
                            item.type === 'answer_received' ? (
                              <FileTextOutlined />
                            ) : item.type === 'question_created' ? (
                              <BookOutlined />
                            ) : (
                              <CheckCircleOutlined />
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
                              <Tag color="blue" className="ml-2">
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
                <ClockCircleOutlined className="text-slate-300 text-5xl mb-4" />
                <Title level={5} className="text-slate-400 mb-2">
                  Hozircha biologiya faoliyati yo'q
                </Title>
                <Text className="text-slate-500">
                  Biologiya savollari yaratib, sinf tayinlangandan so'ng
                  faoliyat ko'rinadi
                </Text>
              </div>
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
}
