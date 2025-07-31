'use client';

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  FileText,
  Users,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  User
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
  Modal,
  Form,
  Input,
  Select,
  Tooltip,
  InputNumber,
  Space
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import NotFoundPage from '../NotFounds/NotFoundPage';

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

// Mock data types (oldingi fayllardan)
export type QuestionDto = {
  id: string;
  subjectId: string;
  grade: number;
  level: number;
  resourceIds?: string[];
  questionText: string;
  type: 'text';
  status: 'active' | 'archived';
  createdBy: string;
  createdAt: string;
};

export type AnswerDto = {
  id: string;
  questionId: string;
  studentId: string;
  classId: string; // Qo'shildi - qaysi sinfdan
  answerText: string;
  status: 'pending' | 'accepted' | 'rejected';
  score?: number;
  rejectionReason?: string;
  answeredAt: string;
};

// Mock data
const mockSubjects = [
  { id: '1', name: 'Matematika' },
  { id: '2', name: 'Fizika' },
  { id: '3', name: 'Kimyo' },
  { id: '4', name: 'Biologiya' },
  { id: '5', name: 'Tarix' },
  { id: '6', name: 'Geografiya' },
  { id: '7', name: 'Adabiyot' }
];

const mockStudents = [
  { id: 'student-001', fullName: 'Ali Valiyev', classId: 'class-001' },
  { id: 'student-002', fullName: 'Gulnoza Karimova', classId: 'class-001' },
  { id: 'student-003', fullName: 'Davron Saidov', classId: 'class-002' },
  { id: 'student-004', fullName: 'Zarina Alimova', classId: 'class-002' },
  { id: 'student-005', fullName: 'Farhod Olimov', classId: 'class-003' }
];

const mockClasses = [
  { id: 'class-001', name: '10-A sinf', grade: 10 },
  { id: 'class-002', name: '10-B sinf', grade: 10 },
  { id: 'class-003', name: '11-A sinf', grade: 11 },
  { id: 'class-004', name: '9-A sinf', grade: 9 }
];

const mockQuestions: QuestionDto[] = [
  {
    id: 'q-001',
    subjectId: '1',
    grade: 10,
    level: 5,
    resourceIds: ['res-001'],
    questionText:
      "Pifagor teoremasini ta'riflang va misol keltiring. Bu teorema to'g'ri burchakli uchburchaklarda qanday qo'llaniladi?",
    type: 'text',
    status: 'active',
    createdBy: 'teacher1',
    createdAt: '2024-07-20'
  },
  {
    id: 'q-002',
    subjectId: '4',
    grade: 11,
    level: 3,
    resourceIds: ['res-004'],
    questionText:
      "Hujayra membranasining tuzilishi va funksiyalari haqida batafsil ma'lumot bering.",
    type: 'text',
    status: 'active',
    createdBy: 'teacher2',
    createdAt: '2024-07-22'
  }
];

const mockAnswers: AnswerDto[] = [
  {
    id: 'ans-001',
    questionId: 'q-001',
    studentId: 'student-001',
    classId: 'class-001',
    answerText:
      "Pifagor teoremasi to'g'ri burchakli uchburchakning tomonlari orasidagi bog'liqlikni ifodalaydi: a² + b² = c². Bu teorema geometriyada masofalarni hisoblashda keng qo'llaniladi.",
    status: 'accepted',
    score: 90,
    answeredAt: '2024-07-25 10:00'
  },
  {
    id: 'ans-002',
    questionId: 'q-001',
    studentId: 'student-002',
    classId: 'class-001',
    answerText:
      "Pifagor teoremasi: gipotenuza kvadrati katetlar kvadratlari yig'indisiga teng. Masalan, 3-4-5 uchburchakda.",
    status: 'pending',
    answeredAt: '2024-07-25 11:30'
  },
  {
    id: 'ans-003',
    questionId: 'q-001',
    studentId: 'student-003',
    classId: 'class-002',
    answerText:
      "Bu teorema matematik formula bo'lib, to'g'ri burchakli uchburchaklarda ishlatiladi.",
    status: 'rejected',
    rejectionReason: "Javob to'liq emas, misol keltirilmagan",
    answeredAt: '2024-07-25 12:00'
  },
  {
    id: 'ans-004',
    questionId: 'q-001',
    studentId: 'student-004',
    classId: 'class-002',
    answerText: 'a² + b² = c² formulasi',
    status: 'pending',
    answeredAt: '2024-07-25 14:00'
  }
];

export default function QuestionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [question, setQuestion] = useState<QuestionDto | null>(null);
  const [answers, setAnswers] = useState<AnswerDto[]>([]);
  const [filteredAnswers, setFilteredAnswers] = useState<AnswerDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [classFilter, setClassFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isPreviewModalVisible, setIsPreviewModalVisible] = useState(false);
  const [previewAnswer, setPreviewAnswer] = useState<AnswerDto | null>(null);
  const [answerForm] = Form.useForm();

  useEffect(() => {
    setLoading(true);
    // Simulate fetching data
    const foundQuestion = mockQuestions.find((q) => q.id === id);
    if (foundQuestion) {
      setQuestion(foundQuestion);
      const questionAnswers = mockAnswers.filter((a) => a.questionId === id);
      setAnswers(questionAnswers);
      setFilteredAnswers(questionAnswers);
    } else {
      message.error('Savol topilmadi!');
      navigate('/dashboard/questions');
    }
    setLoading(false);
  }, [id, navigate]);

  // Filter answers
  useEffect(() => {
    let filtered = answers;

    if (classFilter !== 'all') {
      filtered = filtered.filter((answer) => answer.classId === classFilter);
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter((answer) => answer.status === statusFilter);
    }

    setFilteredAnswers(filtered);
  }, [answers, classFilter, statusFilter]);

  // Helper functions
  const getSubjectName = (subjectId: string) => {
    const subject = mockSubjects.find((s) => s.id === subjectId);
    return subject ? subject.name : "Noma'lum fan";
  };

  const getStudentName = (studentId: string) => {
    const student = mockStudents.find((s) => s.id === studentId);
    return student ? student.fullName : "Noma'lum o'quvchi";
  };

  const getClassName = (classId: string) => {
    const classItem = mockClasses.find((c) => c.id === classId);
    return classItem ? classItem.name : "Noma'lum sinf";
  };

  // Get available classes for this question's grade
  const getAvailableClasses = () => {
    if (!question) return [];
    return mockClasses.filter((c) => c.grade === question.grade);
  };

  // Handle answer status change
  const handleAnswerStatusChange = (
    answerId: string,
    newStatus: 'accepted' | 'rejected',
    score?: number,
    reason?: string
  ) => {
    setAnswers(
      answers.map((ans) => {
        if (ans.id === answerId) {
          return {
            ...ans,
            status: newStatus,
            score: newStatus === 'accepted' ? score : undefined,
            rejectionReason: newStatus === 'rejected' ? reason : undefined
          };
        }
        return ans;
      })
    );
    message.success(`Javob holati "${newStatus}" ga o'zgartirildi!`);
  };

  // Handle preview
  const handlePreview = (answer: AnswerDto) => {
    setPreviewAnswer(answer);
    setIsPreviewModalVisible(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-100px)] dark:text-white">
        Yuklanmoqda...
      </div>
    );
  }

  if (!question) {
    return <NotFoundPage />;
  }

  // Calculate statistics
  const stats = {
    total: answers.length,
    pending: answers.filter((a) => a.status === 'pending').length,
    accepted: answers.filter((a) => a.status === 'accepted').length,
    rejected: answers.filter((a) => a.status === 'rejected').length
  };

  const answerColumns: ColumnsType<AnswerDto> = [
    {
      title: "O'quvchi",
      key: 'student',
      render: (record: AnswerDto) => (
        <div className="flex items-center gap-2">
          <User size={16} className="text-slate-400" />
          <div>
            <div className="font-medium text-slate-900 dark:text-white">
              {getStudentName(record.studentId)}
            </div>
            <div className="text-sm text-slate-500">
              {getClassName(record.classId)}
            </div>
          </div>
        </div>
      )
    },
    {
      title: 'Javob (Preview)',
      dataIndex: 'answerText',
      key: 'answerText',
      render: (text: string, record: AnswerDto) => (
        <div className="max-w-xs">
          <Text
            className="text-slate-700 dark:text-slate-300"
            ellipsis={{ tooltip: false }}
          >
            {text.length > 100 ? `${text.substring(0, 100)}...` : text}
          </Text>
          {text.length > 100 && (
            <Button
              type="link"
              size="small"
              onClick={() => handlePreview(record)}
              className="p-0 h-auto text-blue-500"
            >
              Ko'proq ko'rish
            </Button>
          )}
        </div>
      )
    },
    {
      title: 'Holat',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag
          color={
            status === 'accepted'
              ? 'green'
              : status === 'rejected'
              ? 'red'
              : 'orange'
          }
        >
          {status === 'accepted'
            ? 'Qabul qilingan'
            : status === 'rejected'
            ? 'Rad etilgan'
            : 'Kutilyapti'}
        </Tag>
      )
    },
    {
      title: 'Ball',
      dataIndex: 'score',
      key: 'score',
      render: (score?: number) =>
        score !== undefined ? <Tag color="blue">{score}</Tag> : '-'
    },
    {
      title: 'Sana',
      dataIndex: 'answeredAt',
      key: 'answeredAt',
      render: (date: string) => (
        <Text className="text-sm text-slate-600 dark:text-slate-400">
          {date}
        </Text>
      )
    },
    {
      title: 'Amallar',
      key: 'actions',
      render: (record: AnswerDto) => (
        <Space size="small">
          <Tooltip title="To'liq ko'rish">
            <Button
              type="text"
              icon={<Eye size={16} />}
              onClick={() => handlePreview(record)}
            />
          </Tooltip>
          {record.status === 'pending' && (
            <>
              <Button
                type="primary"
                size="small"
                onClick={() => {
                  Modal.confirm({
                    title: 'Javobni qabul qilish',
                    content: (
                      <Form form={answerForm} layout="vertical">
                        <Form.Item
                          name="score"
                          label="Ball"
                          rules={[
                            { required: true, message: 'Ball kiriting!' }
                          ]}
                        >
                          <InputNumber
                            min={0}
                            max={100}
                            placeholder="0-100"
                            style={{ width: '100%' }}
                          />
                        </Form.Item>
                      </Form>
                    ),
                    onOk: () => {
                      answerForm.validateFields().then((values) => {
                        handleAnswerStatusChange(
                          record.id,
                          'accepted',
                          values.score
                        );
                        answerForm.resetFields();
                      });
                    }
                  });
                }}
              >
                Qabul qilish
              </Button>
              <Button
                danger
                size="small"
                onClick={() => {
                  Modal.confirm({
                    title: 'Javobni rad etish',
                    content: (
                      <Form form={answerForm} layout="vertical">
                        <Form.Item
                          name="reason"
                          label="Rad etish sababi"
                          rules={[
                            { required: true, message: 'Sababini kiriting!' }
                          ]}
                        >
                          <TextArea
                            rows={3}
                            placeholder="Nima uchun rad etilayotganini tushuntiring..."
                          />
                        </Form.Item>
                      </Form>
                    ),
                    onOk: () => {
                      answerForm.validateFields().then((values) => {
                        handleAnswerStatusChange(
                          record.id,
                          'rejected',
                          undefined,
                          values.reason
                        );
                        answerForm.resetFields();
                      });
                    }
                  });
                }}
              >
                Rad etish
              </Button>
            </>
          )}
          {record.status === 'rejected' && record.rejectionReason && (
            <Tooltip title={`Sabab: ${record.rejectionReason}`}>
              <Button
                type="text"
                icon={<Eye size={16} />}
                className="text-red-500"
              />
            </Tooltip>
          )}
        </Space>
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
            onClick={() => navigate('/dashboard/questions')}
            className="!text-slate-600 dark:!text-slate-400 !mb-2"
          >
            Savollar ro'yxatiga qaytish
          </Button>
          <Title level={2} className="!mb-2 text-slate-900 dark:text-white">
            Savol tafsilotlari
          </Title>
          <Text className="text-slate-600 dark:text-slate-400">
            {getSubjectName(question.subjectId)} • {question.grade}-sinf •{' '}
            {question.level}-daraja
          </Text>
        </div>
      </div>

      {/* Question Card */}
      <Card className="bg-white dark:bg-[#101010] border-slate-200 dark:border-slate-800">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-[#6bd281] rounded-lg flex items-center justify-center flex-shrink-0">
            <FileText className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-3">
              <Tag color="blue">{getSubjectName(question.subjectId)}</Tag>
              <Tag color="purple">{question.grade}-sinf</Tag>
              <Tag color="geekblue">{question.level}-daraja</Tag>
              <Tag color={question.status === 'active' ? 'green' : 'red'}>
                {question.status === 'active' ? 'Faol' : 'Arxivlangan'}
              </Tag>
            </div>
            <Title level={4} className="!mb-3 text-slate-900 dark:text-white">
              Savol matni:
            </Title>
            <Text className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              {question.questionText}
            </Text>
            <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
              <Text className="text-sm text-slate-500">
                Yaratilgan: {question.createdAt} • Yaratuvchi:{' '}
                {question.createdBy}
              </Text>
            </div>
          </div>
        </div>
      </Card>

      {/* Statistics */}
      <Row gutter={[24, 24]}>
        <Col xs={24} sm={6}>
          <div className="bg-gradient-to-br p-4 rounded-lg from-blue-400 to-blue-600 border-0">
            <Statistic
              title={<span className="text-white">Jami Javoblar</span>}
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
        <Col xs={24} sm={6}>
          <div className="bg-gradient-to-br p-4 rounded-lg from-orange-400 to-orange-600 border-0">
            <Statistic
              title={<span className="text-white">Kutilayotgan</span>}
              value={stats.pending}
              prefix={<Clock className="text-white" />}
              valueStyle={{
                fontSize: '2rem',
                fontWeight: 'bold',
                color: 'white'
              }}
            />
          </div>
        </Col>
        <Col xs={24} sm={6}>
          <div className="bg-gradient-to-br p-4 rounded-lg from-green-400 to-green-600 border-0">
            <Statistic
              title={<span className="text-white">Qabul qilingan</span>}
              value={stats.accepted}
              prefix={<CheckCircle className="text-white" />}
              valueStyle={{
                fontSize: '2rem',
                fontWeight: 'bold',
                color: 'white'
              }}
            />
          </div>
        </Col>
        <Col xs={24} sm={6}>
          <div className="bg-gradient-to-br p-4 rounded-lg from-red-400 to-red-600 border-0">
            <Statistic
              title={<span className="text-white">Rad etilgan</span>}
              value={stats.rejected}
              prefix={<XCircle className="text-white" />}
              valueStyle={{
                fontSize: '2rem',
                fontWeight: 'bold',
                color: 'white'
              }}
            />
          </div>
        </Col>
      </Row>

      {/* Filters */}
      <Card className="bg-white dark:bg-[#101010] border-slate-200 dark:border-slate-800">
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={8}>
            <Select
              placeholder="Sinf bo'yicha filtrlash"
              value={classFilter}
              onChange={setClassFilter}
              style={{ width: '100%' }}
            >
              <Option value="all">Barcha sinflar</Option>
              {getAvailableClasses().map((classItem) => (
                <Option key={classItem.id} value={classItem.id}>
                  {classItem.name}
                </Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} sm={8}>
            <Select
              placeholder="Holat bo'yicha filtrlash"
              value={statusFilter}
              onChange={setStatusFilter}
              style={{ width: '100%' }}
            >
              <Option value="all">Barcha holatlar</Option>
              <Option value="pending">Kutilayotgan</Option>
              <Option value="accepted">Qabul qilingan</Option>
              <Option value="rejected">Rad etilgan</Option>
            </Select>
          </Col>
          <Col xs={24} sm={8}>
            <div className="flex justify-end">
              <Text className="text-slate-600 dark:text-slate-400">
                Ko'rsatilmoqda: {filteredAnswers.length} / {answers.length} ta
                javob
              </Text>
            </div>
          </Col>
        </Row>
      </Card>

      {/* Answers Table */}
      <Card
        className="bg-white dark:bg-[#101010] border-slate-200 dark:border-slate-800"
        title={
          <Title level={4} className="!mb-0 text-slate-900 dark:text-white">
            Javoblar ro'yxati
          </Title>
        }
      >
        {filteredAnswers.length > 0 ? (
          <Table
            columns={answerColumns}
            dataSource={filteredAnswers}
            rowKey="id"
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} / ${total} ta`
            }}
            scroll={{ x: 800 }}
            size="middle"
          />
        ) : (
          <div className="text-center py-8">
            <Text className="text-slate-600 dark:text-slate-400">
              Bu savolga hali javob berilmagan.
            </Text>
          </div>
        )}
      </Card>

      {/* Preview Modal */}
      <Modal
        title="Javobni to'liq ko'rish"
        open={isPreviewModalVisible}
        onCancel={() => {
          setIsPreviewModalVisible(false);
          setPreviewAnswer(null);
        }}
        footer={null}
        width={700}
      >
        {previewAnswer && (
          <div className="space-y-4">
            <div>
              <Text strong className="text-slate-900 dark:text-white">
                O'quvchi:{' '}
              </Text>
              <Text className="text-slate-700 dark:text-slate-300">
                {getStudentName(previewAnswer.studentId)}
              </Text>
            </div>
            <div>
              <Text strong className="text-slate-900 dark:text-white">
                Sinf:{' '}
              </Text>
              <Text className="text-slate-700 dark:text-slate-300">
                {getClassName(previewAnswer.classId)}
              </Text>
            </div>
            <div>
              <Text strong className="text-slate-900 dark:text-white">
                Holat:{' '}
              </Text>
              <Tag
                color={
                  previewAnswer.status === 'accepted'
                    ? 'green'
                    : previewAnswer.status === 'rejected'
                    ? 'red'
                    : 'orange'
                }
              >
                {previewAnswer.status === 'accepted'
                  ? 'Qabul qilingan'
                  : previewAnswer.status === 'rejected'
                  ? 'Rad etilgan'
                  : 'Kutilyapti'}
              </Tag>
            </div>
            {previewAnswer.score !== undefined && (
              <div>
                <Text strong className="text-slate-900 dark:text-white">
                  Ball:{' '}
                </Text>
                <Tag color="blue">{previewAnswer.score}</Tag>
              </div>
            )}
            <div>
              <Text strong className="text-slate-900 dark:text-white">
                Javob matni:
              </Text>
              <div className="mt-2 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                <Text className="text-slate-700 dark:text-slate-300 leading-relaxed">
                  {previewAnswer.answerText}
                </Text>
              </div>
            </div>
            {previewAnswer.rejectionReason && (
              <div>
                <Text strong className="text-red-600">
                  Rad etish sababi:
                </Text>
                <div className="mt-2 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                  <Text className="text-red-700 dark:text-red-300">
                    {previewAnswer.rejectionReason}
                  </Text>
                </div>
              </div>
            )}
            <div>
              <Text strong className="text-slate-900 dark:text-white">
                Javob berilgan vaqt:{' '}
              </Text>
              <Text className="text-slate-700 dark:text-slate-300">
                {previewAnswer.answeredAt}
              </Text>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
