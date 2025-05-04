import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { addTemplate, removeTemplate, applyTemplate } from '../store/slices/shiftSlice';
import styled from '@emotion/styled';
import { Template } from '../types';

const Container = styled.div`
  padding: 1rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const TemplateList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1rem;
`;

const TemplateCard = styled.div`
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Button = styled.button`
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  background: #4CAF50;
  color: white;
  margin-left: 0.5rem;

  &:hover {
    background: #45a049;
  }

  &.delete {
    background: #f44336;

    &:hover {
      background: #da190b;
    }
  }
`;

const Form = styled.form`
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const Input = styled.input`
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  flex: 1;
`;

interface TemplateManagementProps {
  onClose: () => void;
}

const TemplateManagement: React.FC<TemplateManagementProps> = ({ onClose }) => {
  const dispatch = useDispatch();
  const { templates, patterns } = useSelector((state: RootState) => state.shift);
  const [newTemplateName, setNewTemplateName] = useState('');

  const handleSaveTemplate = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTemplateName.trim() && patterns.length > 0) {
      const newTemplate: Template = {
        id: Date.now().toString(),
        name: newTemplateName.trim(),
        patterns: [...patterns],
      };
      dispatch(addTemplate(newTemplate));
      setNewTemplateName('');
    }
  };

  const handleApplyTemplate = (templateId: string) => {
    const startDate = new Date();
    dispatch(applyTemplate({ templateId, startDate }));
  };

  const handleRemoveTemplate = (templateId: string) => {
    if (window.confirm('このテンプレートを削除してもよろしいですか？')) {
      dispatch(removeTemplate(templateId));
    }
  };

  return (
    <Container>
      <h2>テンプレート管理</h2>
      <Form onSubmit={handleSaveTemplate}>
        <Input
          type="text"
          value={newTemplateName}
          onChange={(e) => setNewTemplateName(e.target.value)}
          placeholder="テンプレート名"
          required
        />
        <Button type="submit">現在のシフトを保存</Button>
      </Form>
      <TemplateList>
        {templates.map((template) => (
          <TemplateCard key={template.id}>
            <div>
              <strong>{template.name}</strong>
              <span>（{template.patterns.length}件のシフト）</span>
            </div>
            <div>
              <Button onClick={() => handleApplyTemplate(template.id)}>
                適用
              </Button>
              <Button
                className="delete"
                onClick={() => handleRemoveTemplate(template.id)}
              >
                削除
              </Button>
            </div>
          </TemplateCard>
        ))}
      </TemplateList>
    </Container>
  );
};

export default TemplateManagement; 