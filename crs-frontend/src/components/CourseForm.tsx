import { useEffect, useState } from 'react';
import type { Course, CourseFormValues } from '../types/course';

interface CourseFormProps {
  course?: Course | null;
  submitting: boolean;
  serverError: string;
  onSubmit: (values: CourseFormValues) => Promise<void>;
  onCancel: () => void;
}

interface FormErrors {
  tenMonHoc?: string;
  soTinChi?: string;
  soChoToiDa?: string;
}

const toFormValues = (course?: Course | null): CourseFormValues => ({
  tenMonHoc: course?.tenMonHoc ?? '',
  soTinChi: course ? String(course.soTinChi) : '',
  soChoToiDa: course ? String(course.soChoToiDa) : '',
});

function CourseForm({ course, submitting, serverError, onSubmit, onCancel }: CourseFormProps) {
  const [values, setValues] = useState<CourseFormValues>(() => toFormValues(course));
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    setValues(toFormValues(course));
    setErrors({});
  }, [course]);

  const validate = (): FormErrors => {
    const nextErrors: FormErrors = {};
    const credits = Number(values.soTinChi);
    const capacity = Number(values.soChoToiDa);

    if (!values.tenMonHoc.trim()) nextErrors.tenMonHoc = 'Tên môn học không được để trống.';
    if (!values.soTinChi || !Number.isInteger(credits) || credits < 1) {
      nextErrors.soTinChi = 'Số tín chỉ phải là số nguyên lớn hơn 0.';
    }
    if (!values.soChoToiDa || !Number.isInteger(capacity) || capacity < 1) {
      nextErrors.soChoToiDa = 'Số chỗ tối đa phải là số nguyên lớn hơn 0.';
    }
    return nextErrors;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;
    await onSubmit(values);
  };

  const updateField = (field: keyof CourseFormValues, value: string) => {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  };

  return (
    <form onSubmit={handleSubmit} noValidate style={{ margin: '24px 0' }}>
      <h2>{course ? 'Sửa môn học' : 'Thêm môn học'}</h2>
      {serverError && <p style={{ color: 'red' }}>{serverError}</p>}
      <label style={{ display: 'block', marginBottom: 12 }}>
        Tên môn học
        <input
          value={values.tenMonHoc}
          onChange={(event) => updateField('tenMonHoc', event.target.value)}
          disabled={submitting}
          style={{ display: 'block', width: '100%', maxWidth: 400 }}
        />
        {errors.tenMonHoc && <small style={{ color: 'red' }}>{errors.tenMonHoc}</small>}
      </label>
      <label style={{ display: 'block', marginBottom: 12 }}>
        Số tín chỉ
        <input
          type="number"
          min="1"
          value={values.soTinChi}
          onChange={(event) => updateField('soTinChi', event.target.value)}
          disabled={submitting}
          style={{ display: 'block', width: '100%', maxWidth: 400 }}
        />
        {errors.soTinChi && <small style={{ color: 'red' }}>{errors.soTinChi}</small>}
      </label>
      <label style={{ display: 'block', marginBottom: 12 }}>
        Số chỗ tối đa
        <input
          type="number"
          min="1"
          value={values.soChoToiDa}
          onChange={(event) => updateField('soChoToiDa', event.target.value)}
          disabled={submitting}
          style={{ display: 'block', width: '100%', maxWidth: 400 }}
        />
        {errors.soChoToiDa && <small style={{ color: 'red' }}>{errors.soChoToiDa}</small>}
      </label>
      <button type="submit" disabled={submitting}>
        {submitting ? 'Đang lưu...' : course ? 'Cập nhật' : 'Thêm môn học'}
      </button>{' '}
      {course && <button type="button" onClick={onCancel} disabled={submitting}>Hủy</button>}
    </form>
  );
}

export default CourseForm;
