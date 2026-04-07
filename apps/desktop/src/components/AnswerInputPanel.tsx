import { FormEvent, useState } from 'react';

interface AnswerInputPanelProps {
  disabled?: boolean;
  onSubmit: (answer: string) => void;
}

function AnswerInputPanel({ disabled, onSubmit }: AnswerInputPanelProps) {
  const [answer, setAnswer] = useState('');

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = answer.trim();
    if (!trimmed) return;
    onSubmit(trimmed);
    setAnswer('');
  }

  return (
    <section className="content-card">
      <h2>回答本轮问题</h2>
      <form className="topic-form" onSubmit={handleSubmit}>
        <textarea
          className="text-area"
          disabled={disabled}
          placeholder={disabled ? '请先开始本轮学习，再回答系统给出的诊断问题。' : '在这里写下你的理解、例子或当前困惑。'}
          value={answer}
          onChange={(event) => setAnswer(event.target.value)}
        />
        <button className="primary-button" disabled={disabled} type="submit">
          提交回答并更新本轮沉淀
        </button>
      </form>
    </section>
  );
}

export default AnswerInputPanel;
