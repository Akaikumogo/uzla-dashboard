/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Row,
  Col,
  Typography,
  Button,
  Card,
  Form,
  Input,
  message,
  Table,
  Tag,
  Popconfirm,
  Tooltip,
  Modal,
  Select,
  Upload // Upload komponentini import qilamiz
} from 'antd';
import {
  ArrowLeft,
  Plus,
  Edit,
  Trash2,
  LinkIcon,
  Video,
  ImageIcon,
  FileText,
  BookOpen,
  UploadCloud
} from 'lucide-react';
import type { ColumnsType } from 'antd/es/table';
import type { UploadProps } from 'antd'; // UploadProps tipini import qilamiz

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

// Resource data type
export type ResourceDto = {
  id: string;
  title: string;
  description: string;
  subjectId: string;
  grade: number; // 10 yoki 11
  classId: string; // class-001
  content: {
    videoUrl?: string;
    imageUrl?: string;
    text?: string;
  };
  fileUrl?: string; // Fayl URL'i asosiy ob'ektga ko'chirildi
  fileName?: string; // Fayl nomi asosiy ob'ektga ko'chirildi
  questions: string[]; // bog‘langan savollar ID’lari
  createdBy: string; // userId
  createdAt: string;
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

// Mock classes data
const mockClasses = [
  {
    id: 'class-001',
    name: '10-A sinf',
    grade: 10,
    subjectIds: ['1', '2', '3']
  },
  { id: 'class-002', name: '10-B sinf', grade: 10, subjectIds: ['3', '4'] },
  { id: 'class-003', name: '11-A sinf', grade: 11, subjectIds: ['1', '2'] },
  {
    id: 'class-004',
    name: '9-A sinf',
    grade: 9,
    subjectIds: ['1', '2', '3', '4', '5']
  },
  { id: 'class-005', name: '8-B sinf', grade: 8, subjectIds: ['5', '6', '7'] }
];

// Mock questions data (for linking)
const mockQuestions = [
  { id: 'q1', text: 'Pifagor teoremasi', subjectId: '1', level: 'easy' },
  { id: 'q2', text: 'Kvadrat tenglamalar', subjectId: '1', level: 'medium' },
  { id: 'q3', text: 'Nyuton qonunlari', subjectId: '2', level: 'easy' },
  { id: 'q4', text: 'Organik birikmalar', subjectId: '3', level: 'medium' },
  { id: 'q5', text: 'Hujayra tuzilishi', subjectId: '4', level: 'easy' }
];

const generateMockResources = (): ResourceDto[] => [
  {
    id: 'res-001',
    title: "Algebra bo'yicha qo'llanma",
    description: "10-sinf algebra darsligi uchun qo'shimcha materiallar.",
    subjectId: '1',
    grade: 10,
    classId: 'class-001',
    content: {}, // content ichidan fileUrl olib tashlandi
    fileUrl: '/path/to/algebra_guide.pdf', // Asosiy ob'ektda
    fileName: 'algebra_guide.pdf', // Asosiy ob'ektda
    questions: ['q1', 'q2'],
    createdBy: 'user1',
    createdAt: '2024-07-20'
  },
  {
    id: 'res-002',
    title: "Fizika formulalari to'plami",
    description: "Mexanika va termodinamika bo'yicha asosiy formulalar.",
    subjectId: '2',
    grade: 11,
    classId: 'class-003',
    content: { text: 'Formulalar matni' },
    questions: ['q3'],
    createdBy: 'user2',
    createdAt: '2024-07-22'
  },
  {
    id: 'res-003',
    title: 'Kimyoviy reaksiyalar jadvali',
    description: 'Organik va noorganik kimyo uchun reaksiyalar jadvali.',
    subjectId: '3',
    grade: 10,
    classId: 'class-001',
    content: { imageUrl: '/path/to/chemistry_reactions.png' },
    questions: ['q4'],
    createdBy: 'user1',
    createdAt: '2024-07-25'
  },
  {
    id: 'res-004',
    title: 'Biologiya test savollari',
    description: "Hujayra biologiyasi bo'yicha test savollari to'plami.",
    subjectId: '4',
    grade: 9,
    classId: 'class-004',
    content: {},
    fileUrl: '/path/to/biology_tests.pdf',
    fileName: 'biology_tests.pdf',
    questions: ['q5'],
    createdBy: 'user3',
    createdAt: '2024-07-28'
  }
];

export default function ResourcesClassDetail() {
  const { subjectId, classId } = useParams<{
    subjectId: string;
    classId: string;
  }>();
  const navigate = useNavigate();
  const [resources, setResources] = useState<ResourceDto[]>(
    generateMockResources()
  );
  const [filteredResources, setFilteredResources] = useState<ResourceDto[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isQuestionModalVisible, setIsQuestionModalVisible] = useState(false);
  const [editingResource, setEditingResource] = useState<ResourceDto | null>(
    null
  );
  const [currentResourceForQuestions, setCurrentResourceForQuestions] =
    useState<ResourceDto | null>(null);
  const [form] = Form.useForm();

  const currentSubject = mockSubjects.find((s) => s.id === subjectId);
  const currentClass = mockClasses.find((c) => c.id === classId);

  useEffect(() => {
    if (!currentSubject || !currentClass) {
      message.error('Fan yoki sinf topilmadi!');
      navigate('/dashboard/resources');
      return;
    }
    const filtered = resources.filter(
      (res) =>
        res.subjectId === subjectId &&
        res.classId === classId &&
        res.grade === currentClass.grade
    );
    setFilteredResources(filtered);
  }, [resources, subjectId, classId, currentSubject, currentClass, navigate]);

  // Get subject name by ID
  const getSubjectName = (sId: string) => {
    const subject = mockSubjects.find((s) => s.id === sId);
    return subject ? subject.name : "Noma'lum fan";
  };

  // Get question text by ID
  const getQuestionText = (qId: string) => {
    const question = mockQuestions.find((q) => q.id === qId);
    return question ? question.text : "Noma'lum savol";
  };

  // Handle create new resource
  const handleCreate = () => {
    setEditingResource(null);
    setIsModalVisible(true);
    form.resetFields();
  };

  // Handle edit resource
  const handleEdit = (resource: ResourceDto) => {
    setEditingResource(resource);
    setIsModalVisible(true);
    form.setFieldsValue({
      title: resource.title,
      description: resource.description,
      videoUrl: resource.content.videoUrl,
      imageUrl: resource.content.imageUrl,
      text: resource.content.text,
      // Fayl ma'lumotlarini formaga yuklash
      file: resource.fileName
        ? [
            {
              uid: '-1',
              name: resource.fileName,
              status: 'done',
              url: resource.fileUrl
            }
          ]
        : []
    });
  };

  // Handle delete resource
  const handleDelete = (id: string) => {
    setResources(resources.filter((resource) => resource.id !== id));
    message.success("Resurs muvaffaqiyatli o'chirildi");
  };

  // Handle resource form submit
  const handleSubmit = (values: any) => {
    const content = {
      videoUrl: values.videoUrl || undefined,
      imageUrl: values.imageUrl || undefined,
      text: values.text || undefined
    };

    // Fayl ma'lumotlarini olish
    const uploadedFile =
      values.file && values.file.length > 0 ? values.file[0] : null;
    const fileName = uploadedFile?.name || undefined;
    const fileUrl = uploadedFile?.url || undefined; // Agar mavjud bo'lsa, URL ni oling

    // Validation: At least one content field or file must be filled
    if (!content.videoUrl && !content.imageUrl && !content.text && !fileName) {
      message.error(
        "Kamida bitta manba maydoni (video, rasm, matn) yoki fayl to'ldirilishi shart!"
      );
      return;
    }

    if (editingResource) {
      // Update existing resource
      setResources(
        resources.map((resource) =>
          resource.id === editingResource.id
            ? {
                ...resource,
                title: values.title,
                description: values.description,
                content: content,
                fileUrl: fileUrl, // Yangilangan fayl URL
                fileName: fileName // Yangilangan fayl nomi
              }
            : resource
        )
      );
      message.success('Resurs muvaffaqiyatli yangilandi');
    } else {
      // Create new resource
      const newResource: ResourceDto = {
        id: Date.now().toString(),
        title: values.title,
        description: values.description,
        subjectId: subjectId!,
        grade: currentClass!.grade,
        classId: classId!,
        content: content,
        fileUrl: fileUrl, // Yangi fayl URL
        fileName: fileName, // Yangi fayl nomi
        questions: [], // Initially no questions linked
        createdBy: 'current_user_id', // Placeholder
        createdAt: new Date().toISOString().split('T')[0]
      };
      setResources([...resources, newResource]);
      message.success("Yangi resurs muvaffaqiyatli qo'shildi");
    }

    setIsModalVisible(false);
    form.resetFields();
    setEditingResource(null);
  };

  // Handle link questions
  const handleLinkQuestions = (resource: ResourceDto) => {
    setCurrentResourceForQuestions(resource);
    setIsQuestionModalVisible(true);
  };

  // Handle question link submit
  const handleQuestionLinkSubmit = (data: { questions: string[] }) => {
    if (currentResourceForQuestions) {
      setResources(
        resources.map((resource) =>
          resource.id === currentResourceForQuestions.id
            ? { ...resource, questions: data.questions }
            : resource
        )
      );
      message.success('Savollar muvaffaqiyatli biriktirildi');
    }
    setIsQuestionModalVisible(false);
    setCurrentResourceForQuestions(null);
  };

  // Upload komponenti uchun props
  const uploadProps: UploadProps = {
    name: 'file',
    multiple: false,
    listType: 'text',
    maxCount: 1,
    beforeUpload: (_file) => {
      // Fayl yuklashni oldini oladi, faqat fayl ma'lumotlarini saqlaydi
      // Siz bu yerda fayl turi, hajmi bo'yicha validatsiya qo'shishingiz mumkin
      return false; // Faylni avtomatik yuklashni o'chiradi
    },
    onChange: (info) => {
      // Fayl tanlanganda formadagi 'file' maydonini yangilaydi
      form.setFieldsValue({ file: info.fileList });
    },
    onRemove: () => {
      form.setFieldsValue({ file: [] });
    }
  };

  const columns: ColumnsType<ResourceDto> = [
    {
      title: 'Resurs nomi',
      key: 'title',
      render: (record: ResourceDto) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#6bd281] rounded-lg flex items-center justify-center">
            {record.content.videoUrl ? (
              <Video className="w-5 h-5 text-white" />
            ) : record.content.imageUrl ? (
              <ImageIcon className="w-5 h-5 text-white" />
            ) : record.content.text ? (
              <BookOpen className="w-5 h-5 text-white" />
            ) : record.fileName ? (
              <FileText className="w-5 h-5 text-white" />
            ) : (
              <FileText className="w-5 h-5 text-white" />
            )}
          </div>
          <div>
            <div className="font-medium text-slate-900 dark:text-white">
              {record.title}
            </div>
            <div className="text-sm text-slate-500 truncate max-w-xs">
              {record.description}
            </div>
          </div>
        </div>
      )
    },
    {
      title: 'Manba turi',
      key: 'contentType',
      render: (record: ResourceDto) => {
        if (record.content.videoUrl) return <Tag color="red">Video</Tag>;
        if (record.content.imageUrl) return <Tag color="blue">Rasm</Tag>;
        if (record.content.text) return <Tag color="green">Matn</Tag>;
        if (record.fileName) return <Tag color="purple">Fayl</Tag>;
        return <Tag>Noma'lum</Tag>;
      }
    },
    {
      title: 'Fayl nomi', // Yangi ustun
      dataIndex: 'fileName',
      key: 'fileName',
      render: (fileName: string, record: ResourceDto) =>
        fileName ? (
          <a
            href={record.fileUrl || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline"
          >
            {fileName}
          </a>
        ) : (
          <Text type="secondary">Mavjud emas</Text>
        )
    },
    {
      title: 'Biriktirilgan savollar',
      dataIndex: 'questions',
      key: 'questions',
      render: (questions: string[]) => (
        <div className="flex flex-wrap gap-1">
          {questions.length > 0 ? (
            questions.map((qId) => (
              <Tag key={qId} color="cyan" className="text-xs">
                {getQuestionText(qId)}
              </Tag>
            ))
          ) : (
            <Tag color="default">Savollar biriktirilmagan</Tag>
          )}
        </div>
      )
    },
    {
      title: 'Yuklangan sana',
      dataIndex: 'createdAt',
      key: 'createdAt',
      sorter: (a: ResourceDto, b: ResourceDto) =>
        a.createdAt.localeCompare(b.createdAt)
    },
    {
      title: 'Amallar',
      key: 'actions',
      render: (record: ResourceDto) => (
        <div className="flex gap-2">
          <Tooltip title="Tahrirlash">
            <Button
              type="text"
              icon={<Edit size={16} />}
              onClick={() => handleEdit(record)}
              className="text-blue-600 hover:text-blue-800"
            />
          </Tooltip>
          <Tooltip title="Savollar biriktirish">
            <Button
              type="text"
              icon={<LinkIcon size={16} />}
              onClick={() => handleLinkQuestions(record)}
              className="text-purple-600 hover:text-purple-800"
            />
          </Tooltip>
          <Popconfirm
            title="Resursni o'chirish"
            description="Haqiqatan ham bu resursni o'chirmoqchimisiz?"
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

  if (!currentSubject || !currentClass) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-100px)] dark:text-white">
        Yuklanmoqda...
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 min-h-full bg-slate-50 dark:bg-[#0f0f0f]">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <Button
            type="text"
            icon={<ArrowLeft size={20} />}
            onClick={() => navigate(`/dashboard/resources/${subjectId}`)}
            className="!text-slate-600 dark:!text-slate-400 !mb-2"
          >
            Sinflar ro'yxatiga qaytish
          </Button>
          <Title level={2} className="!mb-2 text-slate-900 dark:text-white">
            "{currentSubject.name}" fani uchun "{currentClass.name}" manbalari
          </Title>
          <Text className="text-slate-600 dark:text-slate-400">
            Bu sinfga biriktirilgan resurslarni boshqaring
          </Text>
        </div>
        <Button
          type="primary"
          size="large"
          icon={<Plus />}
          onClick={handleCreate}
          className="bg-[#6bd281] hover:bg-[#5bc270] border-[#6bd281]"
        >
          Yangi manba qo'shish
        </Button>
      </div>

      {/* Resources Table */}
      <Card
        className="bg-white dark:bg-[#101010] border-slate-200 dark:border-slate-800 mt-4"
        title={
          <Title level={4} className="!mb-0 text-slate-900 dark:text-white">
            Manbalar Ro'yxati ({filteredResources.length} ta)
          </Title>
        }
      >
        {filteredResources.length > 0 ? (
          <Table
            columns={columns}
            dataSource={filteredResources}
            rowKey="id"
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} / ${total} ta`
            }}
            scroll={{ x: 1000 }}
            size="middle"
          />
        ) : (
          <Text className="text-slate-600 dark:text-slate-400">
            Bu sinf uchun manbalar mavjud emas.
          </Text>
        )}
      </Card>

      {/* Add/Edit Resource Modal */}
      <Modal
        title={editingResource ? 'Resursni tahrirlash' : "Yangi manba qo'shish"}
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
          setEditingResource(null);
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
          <Form.Item
            name="title"
            label="Resurs nomi"
            rules={[{ required: true, message: 'Resurs nomini kiriting' }]}
          >
            <Input placeholder="Masalan: Algebra bo'yicha qo'llanma" />
          </Form.Item>

          <Form.Item
            name="description"
            label="Tavsif"
            rules={[{ required: true, message: 'Resurs tavsifini kiriting' }]}
          >
            <TextArea
              rows={3}
              placeholder="Resurs haqida qisqacha ma'lumot..."
            />
          </Form.Item>

          <Title
            level={5}
            className="!mt-6 !mb-3 text-slate-700 dark:text-slate-300"
          >
            Manba kontenti (kamida bittasini to'ldiring)
          </Title>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="videoUrl" label="Video havola (YouTube, Vimeo)">
                <Input placeholder="https://youtube.com/watch?v=..." />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="imageUrl" label="Rasm havola">
                <Input placeholder="https://example.com/image.jpg" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="text" label="Matn (HTML yoki Markdown)">
                <TextArea rows={4} placeholder="Manba matnini kiriting..." />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="file" label="Fayl yuklash">
                <Upload {...uploadProps}>
                  <Button icon={<UploadCloud size={16} />}>Fayl tanlash</Button>
                </Upload>
                <Text type="secondary" className="text-xs">
                  *Hozircha fayl yuklash simulyatsiya qilinadi. API
                  integratsiyasi keyinroq qo'shiladi.
                </Text>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>

      {/* Link Questions Modal */}
      <Modal
        title={`"${currentResourceForQuestions?.title}" resursiga savollar biriktirish`}
        open={isQuestionModalVisible}
        onCancel={() => {
          setIsQuestionModalVisible(false);
          setCurrentResourceForQuestions(null);
        }}
        onOk={() => {
          // In a real app, you'd get selected questions from a form field
          // For now, let's just use a mock selection
          const selectedQuestions = form.getFieldValue('linkedQuestions') || [];
          handleQuestionLinkSubmit({ questions: selectedQuestions });
        }}
        okText="Biriktirish"
        cancelText="Bekor qilish"
        okButtonProps={{
          style: { backgroundColor: '#6bd281', border: 'none' }
        }}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            questions: currentResourceForQuestions?.questions || []
          }}
        >
          <Form.Item name="linkedQuestions" label="Biriktiriladigan savollar">
            <Select mode="multiple" placeholder="Savollarni tanlang" allowClear>
              {mockQuestions.map((q) => (
                <Option key={q.id} value={q.id}>
                  {q.text} ({getSubjectName(q.subjectId)})
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Text type="secondary" className="text-xs">
            *Savollar ro'yxati hozircha mock data asosida. Yangi savol qo'shish
            funksiyasi keyinroq qo'shiladi.
          </Text>
        </Form>
      </Modal>
    </div>
  );
}
