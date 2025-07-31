/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect } from 'react';
import {
  BookOpen,
  Plus,
  Search,
  Users,
  FileText,
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

// Subject data type
export type SubjectDto = {
  id: string;
  name: string;
  description: string;
  teachers: string[];
  studentsCount: number;
  questionsCount: number;
  createdDate: string;
};

// Mock teachers data
const mockTeachers = [
  { id: '1', name: 'Ahmadjon Karimov' },
  { id: '2', name: 'Malika Tosheva' },
  { id: '3', name: 'Bobur Alimov' },
  { id: '4', name: 'Nilufar Rahimova' },
  { id: '5', name: 'Jasur Nazarov' }
];

// Generate mock subjects
const generateMockSubjects = (): SubjectDto[] => [
  {
    id: 'subject-001',
    name: 'Matematika',
    description: 'Algebra, geometriya va matematik tahlil asoslari',
    teachers: ['1', '3'],
    studentsCount: 1247,
    questionsCount: 3420,
    createdDate: '2023-01-15'
  },
  {
    id: 'subject-002',
    name: 'Fizika',
    description: 'Mexanika, termodinamika va elektr fizikasi',
    teachers: ['2'],
    studentsCount: 892,
    questionsCount: 2156,
    createdDate: '2023-03-20'
  },
  {
    id: 'subject-003',
    name: 'Kimyo',
    description: 'Organik va noorganik kimyo asoslari',
    teachers: ['4', '5'],
    studentsCount: 654,
    questionsCount: 1834,
    createdDate: '2023-06-10'
  },
  {
    id: 'subject-004',
    name: 'Biologiya',
    description: 'Tirik organizmlar va ularning hayoti',
    teachers: ['1'],
    studentsCount: 743,
    questionsCount: 1967,
    createdDate: '2023-09-05'
  },
  {
    id: 'subject-005',
    name: 'Tarix',
    description: "Jahon va O'zbekiston tarixi",
    teachers: ['2', '3'],
    studentsCount: 1089,
    questionsCount: 2543,
    createdDate: '2024-01-20'
  }
];

export default function SubjectsPage() {
  const [subjects, setSubjects] = useState<SubjectDto[]>(
    generateMockSubjects()
  );
  const [filteredSubjects, setFilteredSubjects] = useState<SubjectDto[]>(
    generateMockSubjects()
  );
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingSubject, setEditingSubject] = useState<SubjectDto | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [form] = Form.useForm();

  // Get teacher name by ID
  const getTeacherName = (teacherId: string) => {
    const teacher = mockTeachers.find((t) => t.id === teacherId);
    return teacher ? teacher.name : 'Unknown';
  };

  // Filter subjects
  useEffect(() => {
    let filtered = subjects;

    if (searchTerm) {
      filtered = filtered.filter(
        (subject) =>
          subject.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          subject.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredSubjects(filtered);
  }, [subjects, searchTerm]);

  // Statistics
  const stats = {
    total: subjects.length,
    totalStudents: subjects.reduce((acc, s) => acc + s.studentsCount, 0),
    totalQuestions: subjects.reduce((acc, s) => acc + s.questionsCount, 0),
    totalTeachers: mockTeachers.length
  };

  // Table columns
  const columns: ColumnsType<SubjectDto> = [
    {
      title: 'Fan nomi',
      key: 'name',
      render: (record: SubjectDto) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#6bd281] rounded-lg flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="font-medium text-slate-900 dark:text-white">
              {record.name}
            </div>
            <div className="text-sm text-slate-500 truncate max-w-xs">
              {record.description}
            </div>
          </div>
        </div>
      )
    },
    {
      title: "O'qituvchilar",
      dataIndex: 'teachers',
      key: 'teachers',
      render: (teachers: string[]) => (
        <div className="flex flex-wrap gap-1">
          {teachers.length > 0 ? (
            teachers.map((teacherId) => (
              <Tag key={teacherId} color="blue" className="text-xs">
                {getTeacherName(teacherId)}
              </Tag>
            ))
          ) : (
            <Tag color="default">Tayinlanmagan</Tag>
          )}
        </div>
      )
    },
    {
      title: "O'quvchilar",
      dataIndex: 'studentsCount',
      key: 'studentsCount',
      render: (count: number) => (
        <div className="text-center">
          <div className="text-lg font-semibold text-[#6bd281]">
            {count.toLocaleString()}
          </div>
          <div className="text-xs text-slate-500">o'quvchi</div>
        </div>
      ),
      sorter: (a: SubjectDto, b: SubjectDto) =>
        a.studentsCount - b.studentsCount
    },
    {
      title: 'Savollar',
      dataIndex: 'questionsCount',
      key: 'questionsCount',
      render: (count: number) => (
        <div className="text-center">
          <div className="text-lg font-semibold text-blue-600">
            {count.toLocaleString()}
          </div>
          <div className="text-xs text-slate-500">savol</div>
        </div>
      ),
      sorter: (a: SubjectDto, b: SubjectDto) =>
        a.questionsCount - b.questionsCount
    },
    {
      title: 'Amallar',
      key: 'actions',
      render: (record: SubjectDto) => (
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
            title="Fanni o'chirish"
            description="Haqiqatan ham bu fanni o'chirmoqchimisiz?"
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

  // Handle create new subject
  const handleCreate = () => {
    setEditingSubject(null);
    setIsModalVisible(true);
    form.resetFields();
  };

  // Handle edit subject
  const handleEdit = (subject: SubjectDto) => {
    setEditingSubject(subject);
    setIsModalVisible(true);
    form.setFieldsValue({
      name: subject.name,
      description: subject.description,
      teachers: subject.teachers
    });
  };

  // Handle delete subject
  const handleDelete = (id: string) => {
    setSubjects(subjects.filter((subject) => subject.id !== id));
    message.success("Fan muvaffaqiyatli o'chirildi");
  };

  // Handle form submit
  const handleSubmit = (values: any) => {
    if (editingSubject) {
      // Update existing subject
      setSubjects(
        subjects.map((subject) =>
          subject.id === editingSubject.id ? { ...subject, ...values } : subject
        )
      );
      message.success('Fan muvaffaqiyatli yangilandi');
    } else {
      // Create new subject
      const newSubject: SubjectDto = {
        id: Date.now().toString(),
        ...values,
        teachers: values.teachers || [],
        studentsCount: 0,
        questionsCount: 0,
        createdDate: new Date().toISOString().split('T')[0]
      };
      setSubjects([...subjects, newSubject]);
      message.success("Yangi fan muvaffaqiyatli qo'shildi");
    }

    setIsModalVisible(false);
    form.resetFields();
    setEditingSubject(null);
  };

  return (
    <div className="p-6 space-y-6 min-h-full bg-slate-50 dark:bg-[#0f0f0f]">
      {/* Statistics */}
      <Row gutter={[24, 24]}>
        <Col xs={24} sm={6}>
          <div className="bg-gradient-to-br p-4 rounded-lg  from-green-400 to-green-600 border-0">
            <Statistic
              title={<span className="text-white">Jami Fanlar</span>}
              value={stats.total}
              prefix={<BookOpen className="text-white" />}
              valueStyle={{
                fontSize: '2rem',
                fontWeight: 'bold',
                color: 'white'
              }}
            />
          </div>
        </Col>
        <Col xs={24} sm={6}>
          <div className="bg-gradient-to-br p-4 rounded-lg from-blue-400 to-blue-600 border-0">
            <Statistic
              title={<span className="text-white">Jami O'quvchilar</span>}
              value={stats.totalStudents}
              prefix={<Users className="text-white" />}
              valueStyle={{
                fontSize: '2rem',
                fontWeight: 'bold',
                color: 'white'
              }}
              formatter={(value) => `${Number(value).toLocaleString()}`}
            />
          </div>
        </Col>
        <Col xs={24} sm={6}>
          <div className="bg-gradient-to-br p-4 rounded-lg from-purple-400 to-purple-600 border-0">
            <Statistic
              title={<span className="text-white">Jami Savollar</span>}
              value={stats.totalQuestions}
              prefix={<FileText className="text-white" />}
              valueStyle={{
                fontSize: '2rem',
                fontWeight: 'bold',
                color: 'white'
              }}
              formatter={(value) => `${Number(value).toLocaleString()}`}
            />
          </div>
        </Col>
        <Col xs={24} sm={6}>
          <div className="bg-gradient-to-br p-4 rounded-lg from-green-400 to-green-600 border-0">
            <Statistic
              title={<span className="text-white">O'qituvchilar</span>}
              value={stats.totalTeachers}
              prefix={<Users className="text-white" />}
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
            <Col xs={24} sm={12}>
              <AntSearch
                placeholder="Fanlarni qidirish..."
                allowClear
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                prefix={<Search size={16} />}
              />
            </Col>
            <Col xs={24} sm={12}>
              <div className="flex justify-end">
                <Text className="text-slate-600 dark:text-slate-400">
                  Jami: {filteredSubjects.length} ta fan
                </Text>
              </div>
            </Col>
          </Row>
        </Card>
      </div>
      {/* Subjects Table */}
      <Card
        className="bg-white dark:bg-[#101010] border-slate-200 dark:border-slate-800 mt-4"
        title={
          <div className="flex items-center justify-between">
            <Title level={4} className="!mb-0 text-slate-900 dark:text-white">
              Fanlar Ro'yxati
            </Title>
            <Button
              type="primary"
              size="middle"
              icon={<Plus />}
              onClick={handleCreate}
              className="bg-green-500 hover:bg-green-600 border-green-100"
            >
              Yangi fan qo'shish
            </Button>
          </div>
        }
      >
        <Table
          columns={columns}
          dataSource={filteredSubjects}
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

      {/* Add/Edit Subject Modal */}
      <Modal
        title={editingSubject ? 'Fanni tahrirlash' : "Yangi fan qo'shish"}
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
          setEditingSubject(null);
        }}
        onOk={() => form.submit()}
        okText="Saqlash"
        cancelText="Bekor qilish"
        okButtonProps={{
          style: { backgroundColor: '#6bd281', border: 'none' }
        }}
        width={600}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="name"
            label="Fan nomi"
            rules={[{ required: true, message: 'Fan nomini kiriting' }]}
          >
            <Input placeholder="Fan nomini kiriting" />
          </Form.Item>

          <Form.Item
            name="description"
            label="Tavsif"
            rules={[{ required: true, message: 'Fan tavsifini kiriting' }]}
          >
            <TextArea rows={4} placeholder="Fan haqida qisqacha ma'lumot..." />
          </Form.Item>

          <Form.Item name="teachers" label="O'qituvchilar (ixtiyoriy)">
            <Select
              mode="multiple"
              placeholder="O'qituvchilarni tanlang"
              allowClear
            >
              {mockTeachers.map((teacher) => (
                <Option key={teacher.id} value={teacher.id}>
                  {teacher.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
