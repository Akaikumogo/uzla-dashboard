/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect } from 'react';
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
  Tooltip,
  Popconfirm,
  Card,
  InputNumber,
  Space
} from 'antd'; // Radio va Checkbox importlari olib tashlandi
import { Plus, Search, Edit, Trash2, Eye } from 'lucide-react';
import type { ColumnsType } from 'antd/es/table';

// Import qo'shish
import { Link } from 'react-router-dom';

const { Title, Text } = Typography;
const { Search: AntSearch } = Input;
const { Option } = Select;
const { TextArea } = Input;

// Mock data (oldin mavjud bo'lganlardan foydalanamiz va yangilarini qo'shamiz)
const mockSubjects = [
  { id: '1', name: 'Matematika' },
  { id: '2', name: 'Fizika' },
  { id: '3', name: 'Kimyo' },
  { id: '4', name: 'Biologiya' },
  { id: '5', name: 'Tarix' },
  { id: '6', name: 'Geografiya' },
  { id: '7', name: 'Adabiyot' }
];

const mockResources = [
  { id: 'res-001', title: "Algebra bo'yicha qo'llanma", subjectId: '1' },
  { id: 'res-002', title: "Fizika formulalari to'plami", subjectId: '2' },
  { id: 'res-003', title: 'Kimyoviy reaksiyalar jadvali', subjectId: '3' },
  { id: 'res-004', title: 'Biologiya test savollari', subjectId: '4' }
];

const mockStudents = [
  { id: 'student-001', fullName: 'Ali Valiyev' },
  { id: 'student-002', fullName: 'Gulnoza Karimova' },
  { id: 'student-003', fullName: 'Davron Saidov' },
  { id: 'student-004', fullName: 'Zarina Alimova' }
];

// Question data type
export type QuestionDto = {
  id: string;
  subjectId: string;
  grade: number; // Savol qaysi sinfga tegishli
  level: number; // 1-10 daraja
  resourceIds?: string[]; // Bog'langan resurs ID'lari endi massiv bo'ladi
  questionText: string;
  type: 'text'; // Faqat "text" turi qoldirildi
  // options?: string[] // Olib tashlandi
  // correctAnswers?: string[] // Olib tashlandi
  status: 'active' | 'archived'; // Faol / Arxivlangan
  createdBy: string; // Foydalanuvchi ID'si
  createdAt: string;
};

// Answer data type (Savollarga berilgan javoblar)
export type AnswerDto = {
  id: string;
  questionId: string;
  studentId: string;
  answerText: string; // O'quvchi bergan javob
  status: 'pending' | 'accepted' | 'rejected'; // Kutilyapti / Qabul qilingan / Rad etilgan
  score?: number; // Agar qabul qilingan bo'lsa
  rejectionReason?: string; // Agar rad etilgan bo'lsa
  answeredAt: string;
};

// Mock Questions
const generateMockQuestions = (): QuestionDto[] => [
  {
    id: 'q-001',
    subjectId: '1',
    grade: 10,
    level: 5,
    resourceIds: ['res-001'],
    questionText: "Pifagor teoremasini ta'riflang va misol keltiring.",
    type: 'text', // Faqat "text"
    status: 'active',
    createdBy: 'teacher1',
    createdAt: '2024-07-20'
  },
  {
    id: 'q-002',
    subjectId: '1',
    grade: 10,
    level: 7,
    resourceIds: ['res-001'],
    questionText: "Kvadrat tenglamaning umumiy ko'rinishi qaysi?",
    type: 'text', // Faqat "text"
    status: 'active',
    createdBy: 'teacher1',
    createdAt: '2024-07-21'
  },
  {
    id: 'q-003',
    subjectId: '2',
    grade: 11,
    level: 6,
    resourceIds: ['res-002'],
    questionText: 'Nyutonning birinchi qonuni nima haqida?',
    type: 'text', // Faqat "text"
    status: 'active',
    createdBy: 'teacher2',
    createdAt: '2024-07-22'
  },
  {
    id: 'q-004',
    subjectId: '3',
    grade: 10,
    level: 4,
    resourceIds: ['res-003'],
    questionText: "Suvning kimyoviy formulasi H2O. Bu to'g'rimi?",
    type: 'text', // Faqat "text"
    status: 'active',
    createdBy: 'teacher1',
    createdAt: '2024-07-23'
  },
  {
    id: 'q-005',
    subjectId: '4',
    grade: 9,
    level: 3,
    resourceIds: ['res-004'],
    questionText: "O'simliklar fotosintez jarayonida qaysi gazni yutadi?",
    type: 'text', // Faqat "text"
    status: 'archived',
    createdBy: 'teacher3',
    createdAt: '2024-07-24'
  }
];

// Mock Answers
const generateMockAnswers = (): AnswerDto[] => [
  {
    id: 'ans-001',
    questionId: 'q-001',
    studentId: 'student-001',
    answerText:
      "Pifagor teoremasi to'g'ri burchakli uchburchakning tomonlari orasidagi bog'liqlikni ifodalaydi: a² + b² = c².",
    status: 'accepted',
    score: 90,
    answeredAt: '2024-07-25 10:00'
  },
  {
    id: 'ans-002',
    questionId: 'q-001',
    studentId: 'student-002',
    answerText:
      "Pifagor teoremasi: gipotenuza kvadrati katetlar kvadratlari yig'indisiga teng.",
    status: 'pending',
    answeredAt: '2024-07-25 11:30'
  },
  {
    id: 'ans-003',
    questionId: 'q-002',
    studentId: 'student-001',
    answerText: 'ax^2 + bx + c = 0',
    status: 'accepted',
    score: 100,
    answeredAt: '2024-07-26 09:00'
  },
  {
    id: 'ans-004',
    questionId: 'q-002',
    studentId: 'student-003',
    answerText: 'ax + b = 0',
    status: 'rejected',
    rejectionReason: "Noto'g'ri javob",
    answeredAt: '2024-07-26 10:15'
  }
];

export default function QuestionsPage() {
  const [questions, setQuestions] = useState<QuestionDto[]>(
    generateMockQuestions()
  );
  const [filteredQuestions, setFilteredQuestions] = useState<QuestionDto[]>(
    generateMockQuestions()
  );
  const [isQuestionModalVisible, setIsQuestionModalVisible] = useState(false);
  const [isAnswersModalVisible, setIsAnswersModalVisible] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<QuestionDto | null>(
    null
  );
  const [selectedQuestionForAnswers, setSelectedQuestionForAnswers] =
    useState<QuestionDto | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [subjectFilter, setSubjectFilter] = useState<string>('all');
  const [levelFilter, setLevelFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all'); // For question status
  const [form] = Form.useForm();
  const [answerForm] = Form.useForm(); // Javoblarni tahrirlash uchun alohida form

  // Helper functions
  const getSubjectName = (id: string) =>
    mockSubjects.find((s) => s.id === id)?.name || "Noma'lum fan";
  const getResourceTitle = (ids?: string[]) => {
    if (!ids || ids.length === 0)
      return <Tag color="default">Biriktirilmagan</Tag>;
    return (
      <Space wrap>
        {ids.map((id) => (
          <Tag key={id} color="green">
            {mockResources.find((r) => r.id === id)?.title || "Noma'lum manba"}
          </Tag>
        ))}
      </Space>
    );
  };
  const getStudentName = (id: string) =>
    mockStudents.find((s) => s.id === id)?.fullName || "Noma'lum o'quvchi";

  // Filter questions
  useEffect(() => {
    let filtered = questions;

    if (searchTerm) {
      filtered = filtered.filter((q) =>
        q.questionText.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (subjectFilter !== 'all') {
      filtered = filtered.filter((q) => q.subjectId === subjectFilter);
    }
    if (levelFilter !== 'all') {
      filtered = filtered.filter(
        (q) => q.level === Number.parseInt(levelFilter)
      );
    }
    // typeFilter endi faqat "text" bo'ladi, shuning uchun bu shartni olib tashlash mumkin
    // if (typeFilter !== "all") {
    //   filtered = filtered.filter((q) => q.type === typeFilter)
    // }
    if (statusFilter !== 'all') {
      filtered = filtered.filter((q) => q.status === statusFilter);
    }

    setFilteredQuestions(filtered);
  }, [
    questions,
    searchTerm,
    subjectFilter,
    levelFilter,
    typeFilter,
    statusFilter
  ]);

  // Handle create/edit question
  const handleCreateQuestion = () => {
    setEditingQuestion(null);
    setIsQuestionModalVisible(true);
    form.resetFields();
    form.setFieldsValue({ type: 'text' }); // Default values
  };

  const handleEditQuestion = (question: QuestionDto) => {
    setEditingQuestion(question);
    setIsQuestionModalVisible(true);
    form.setFieldsValue({
      ...question,
      resourceIds: question.resourceIds || [] // resourceIds ni massiv sifatida o'rnating
    });
  };

  const handleDeleteQuestion = (id: string) => {
    setQuestions(questions.filter((q) => q.id !== id));
    message.success("Savol muvaffaqiyatli o'chirildi!");
  };

  const handleQuestionSubmit = (values: any) => {
    // Savol turi faqat "text" bo'lgani uchun options va correctAnswers tekshiruvlari olib tashlandi
    if (editingQuestion) {
      setQuestions(
        questions.map((q) =>
          q.id === editingQuestion.id
            ? {
                ...q,
                ...values,
                type: 'text', // Har doim "text" qilib belgilash
                resourceIds: values.resourceIds || []
              }
            : q
        )
      );
      message.success('Savol muvaffaqiyatli yangilandi!');
    } else {
      const newQuestion: QuestionDto = {
        id: `q-${Date.now()}`,
        ...values,
        type: 'text', // Har doim "text" qilib belgilash
        resourceIds: values.resourceIds || [],
        createdBy: 'current_user_id', // Placeholder
        createdAt: new Date().toISOString().split('T')[0],
        status: 'active' // Yangi savol default faol bo'ladi
      };
      setQuestions([...questions, newQuestion]);
      message.success("Yangi savol muvaffaqiyatli qo'shildi!");
    }
    setIsQuestionModalVisible(false);
    form.resetFields();
    setEditingQuestion(null);
  };

  // Handle answer analysis

  const handleAnswerStatusChange = (
    answerId: string,
    newStatus: 'accepted' | 'rejected',
    score?: number,
    reason?: string
  ) => {
    // Bu yerda mockAnswers ni yangilash kerak
    const updatedAnswers = generateMockAnswers().map((ans) => {
      if (ans.id === answerId) {
        return {
          ...ans,
          status: newStatus,
          score: newStatus === 'accepted' ? score : undefined,
          rejectionReason: newStatus === 'rejected' ? reason : undefined
        };
      }
      return ans;
    });
    // Real ilovada bu API chaqiruvi bo'ladi
    console.log('Updated answers (mock):', updatedAnswers);
    message.success(`Javob holati "${newStatus}" ga o'zgartirildi!`);
    setIsAnswersModalVisible(false); // Modalni yopish
    setSelectedQuestionForAnswers(null); // Tanlangan savolni tozalash
  };

  const questionColumns: ColumnsType<QuestionDto> = [
    {
      title: '№',
      render: (_, __, index) => index + 1,
      width: 50
    },
    {
      title: 'Savol matni',
      dataIndex: 'questionText',
      key: 'questionText',
      ellipsis: true,
      render: (text) => <Tooltip title={text}>{text}</Tooltip>
    },
    {
      title: 'Fan',
      dataIndex: 'subjectId',
      key: 'subject',
      render: (subjectId) => (
        <Tag color="blue">{getSubjectName(subjectId)}</Tag>
      ),
      filters: mockSubjects.map((s) => ({ text: s.name, value: s.id })),
      onFilter: (value: any, record) => record.subjectId === value
    },
    {
      title: 'Daraja',
      dataIndex: 'level',
      key: 'level',
      render: (level) => <Tag color="geekblue">{level}</Tag>,
      sorter: (a, b) => a.level - b.level
    },
    {
      title: 'Turi',
      dataIndex: 'type',
      key: 'type',
      render: (type) => <Tag color="cyan">{type}</Tag>, // Bu har doim "text" bo'ladi
      filters: [
        { text: 'Matn', value: 'text' }
        // Boshqa turlar olib tashlandi
      ],
      onFilter: (value: any, record) => record.type === value
    },
    {
      title: 'Biriktirilgan manba',
      dataIndex: 'resourceIds',
      key: 'resource',
      render: (resourceIds: string[]) => getResourceTitle(resourceIds)
    },
    {
      title: 'Holat',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'active' ? 'green' : 'red'}>
          {status === 'active' ? 'Faol' : 'Arxivlangan'}
        </Tag>
      ),
      filters: [
        { text: 'Faol', value: 'active' },
        { text: 'Arxivlangan', value: 'archived' }
      ],
      onFilter: (value: any, record) => record.status === value
    },
    {
      title: 'Amallar',
      key: 'actions',
      render: (record: QuestionDto) => (
        <Space size="small">
          <Tooltip title="Javoblarni ko'rish">
            <Link to={`/dashboard/questions/${record.id}`}>
              <Button type="text" icon={<Eye size={16} />} />
            </Link>
          </Tooltip>
          <Tooltip title="Tahrirlash">
            <Button
              type="text"
              icon={<Edit size={16} />}
              onClick={() => handleEditQuestion(record)}
            />
          </Tooltip>
          <Popconfirm
            title="Savolni o'chirish"
            description="Haqiqatan ham bu savolni o'chirmoqchimisiz?"
            onConfirm={() => handleDeleteQuestion(record.id)}
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
        </Space>
      )
    }
  ];

  const answerColumns: ColumnsType<AnswerDto> = [
    {
      title: "O'quvchi",
      dataIndex: 'studentId',
      key: 'student',
      render: (studentId) => getStudentName(studentId)
    },
    {
      title: 'Javob',
      dataIndex: 'answerText',
      key: 'answerText',
      ellipsis: true,
      render: (text) => <Tooltip title={text}>{text}</Tooltip>
    },
    {
      title: 'Holat',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
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
      render: (score) => (score !== undefined ? score : '-')
    },
    {
      title: 'Sanasi',
      dataIndex: 'answeredAt',
      key: 'answeredAt'
    },
    {
      title: 'Amal',
      key: 'action',
      render: (record: AnswerDto) => (
        <Space size="small">
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
                          <InputNumber min={0} max={100} />
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
                          label="Sabab"
                          rules={[
                            { required: true, message: 'Sababini kiriting!' }
                          ]}
                        >
                          <TextArea rows={2} />
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
              <Button type="text" icon={<Eye size={16} />} />
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
          <Title level={2} className="!mb-2 text-slate-900 dark:text-white">
            Savollar boshqaruvi
          </Title>
          <Text className="text-slate-600 dark:text-slate-400">
            Platformadagi savollarni boshqaring va tahlil qiling
          </Text>
        </div>
        <Button
          type="primary"
          size="large"
          icon={<Plus />}
          onClick={handleCreateQuestion}
          className="bg-[#6bd281] hover:bg-[#5bc270] border-[#6bd281]"
        >
          Yangi savol qo'shish
        </Button>
      </div>

      {/* Filters and Search */}
      <Card className="bg-white dark:bg-[#101010] border-slate-200 dark:border-slate-800">
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={8} md={6}>
            <AntSearch
              placeholder="Savol matnini qidirish..."
              allowClear
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              prefix={<Search size={16} />}
            />
          </Col>
          <Col xs={24} sm={8} md={4}>
            <Select
              placeholder="Fan bo'yicha filtrlash"
              value={subjectFilter}
              onChange={setSubjectFilter}
              style={{ width: '100%' }}
            >
              <Option value="all">Barcha fanlar</Option>
              {mockSubjects.map((subject) => (
                <Option key={subject.id} value={subject.id}>
                  {subject.name}
                </Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} sm={8} md={4}>
            <Select
              placeholder="Daraja bo'yicha filtrlash"
              value={levelFilter}
              onChange={setLevelFilter}
              style={{ width: '100%' }}
            >
              <Option value="all">Barcha darajalar</Option>
              {Array.from({ length: 10 }, (_, i) => i + 1).map((level) => (
                <Option key={level} value={level.toString()}>
                  {level}-daraja
                </Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} sm={8} md={4}>
            <Select
              placeholder="Turi bo'yicha filtrlash"
              value={typeFilter}
              onChange={setTypeFilter}
              style={{ width: '100%' }}
            >
              <Option value="all">Barcha turlar</Option>
              <Option value="text">Matn</Option>
            </Select>
          </Col>
          <Col xs={24} sm={8} md={4}>
            <Select
              placeholder="Holat bo'yicha filtrlash"
              value={statusFilter}
              onChange={setStatusFilter}
              style={{ width: '100%' }}
            >
              <Option value="all">Barcha holatlar</Option>
              <Option value="active">Faol</Option>
              <Option value="archived">Arxivlangan</Option>
            </Select>
          </Col>
        </Row>
      </Card>

      {/* Questions Table */}
      <Card
        className="bg-white dark:bg-[#101010] border-slate-200 dark:border-slate-800 mt-4"
        title={
          <Title level={4} className="!mb-0 text-slate-900 dark:text-white">
            Savollar Ro'yxati ({filteredQuestions.length} ta)
          </Title>
        }
      >
        <Table
          columns={questionColumns}
          dataSource={filteredQuestions}
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

      {/* Add/Edit Question Modal */}
      <Modal
        title={editingQuestion ? 'Savolni tahrirlash' : "Yangi savol qo'shish"}
        open={isQuestionModalVisible}
        onCancel={() => {
          setIsQuestionModalVisible(false);
          form.resetFields();
          setEditingQuestion(null);
        }}
        onOk={() => form.submit()}
        okText="Saqlash"
        cancelText="Bekor qilish"
        okButtonProps={{
          style: { backgroundColor: '#6bd281', border: 'none' }
        }}
        width={700}
      >
        <Form form={form} layout="vertical" onFinish={handleQuestionSubmit}>
          <Form.Item
            name="questionText"
            label="Savol matni"
            rules={[{ required: true, message: 'Savol matnini kiriting!' }]}
          >
            <TextArea rows={4} placeholder="Savol matnini kiriting..." />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="subjectId"
                label="Fan"
                rules={[{ required: true, message: 'Fanni tanlang!' }]}
              >
                <Select placeholder="Fanni tanlang">
                  {mockSubjects.map((subject) => (
                    <Option key={subject.id} value={subject.id}>
                      {subject.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="grade"
                label="Sinf"
                rules={[{ required: true, message: 'Sinfni tanlang!' }]}
              >
                <Select placeholder="Sinfni tanlang">
                  {[8, 9, 10, 11].map((g) => (
                    <Option key={g} value={g}>
                      {g}-sinf
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="level"
                label="Daraja (1-10)"
                rules={[{ required: true, message: 'Darajani kiriting!' }]}
              >
                <InputNumber
                  min={1}
                  max={10}
                  placeholder="5"
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="resourceIds"
                label="Manbaga bog'lash (ixtiyoriy)"
              >
                <Select
                  mode="multiple"
                  placeholder="Manbani tanlang"
                  allowClear
                >
                  {mockResources.map((resource) => (
                    <Option key={resource.id} value={resource.id}>
                      {resource.title} ({getSubjectName(resource.subjectId)})
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          {/* Savol turi endi faqat "text" bo'lgani uchun bu qism olib tashlandi */}
          <Form.Item name="type" label="Savol turi" initialValue="text" hidden>
            <Input /> {/* Hidden input to hold the "text" value */}
          </Form.Item>

          <Form.Item
            name="status"
            label="Holat"
            initialValue="active"
            rules={[{ required: true, message: 'Holatni tanlang!' }]}
          >
            <Select>
              <Option value="active">Faol</Option>
              <Option value="archived">Arxivlangan</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      {/* Answers Analysis Modal */}
      <Modal
        title={`"${selectedQuestionForAnswers?.questionText}" savoliga javoblar`}
        open={isAnswersModalVisible}
        onCancel={() => {
          setIsAnswersModalVisible(false);
          setSelectedQuestionForAnswers(null);
        }}
        footer={null}
        width={900}
      >
        {selectedQuestionForAnswers ? (
          <Table
            columns={answerColumns}
            dataSource={generateMockAnswers().filter(
              (ans) => ans.questionId === selectedQuestionForAnswers.id
            )}
            rowKey="id"
            pagination={{ pageSize: 5 }}
            scroll={{ x: 700 }}
            size="middle"
          />
        ) : (
          <Text>Javoblar topilmadi.</Text>
        )}
      </Modal>
    </div>
  );
}
