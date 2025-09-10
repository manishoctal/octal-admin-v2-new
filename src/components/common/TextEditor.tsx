import { Controller } from 'react-hook-form';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { useTranslation } from '../TranslationContext';

const QuillEditor = ({
  name,
  controlField,
  defaultValue,
  placeholder,
  readOnly,
  errors,
}) => {
  const { t } = useTranslation()
  return (
    <div className="">
      <Controller
        name={name}
        control={controlField}
        defaultValue={defaultValue}
        rules={{
          required: t('CONTENT_IS_REQUIRED'),
          validate: (value) => {
            const strippedContent = value.replace(/<[^>]*>?/gm, '').trim();
            return strippedContent.length > 0 || t('CONTENT_IS_REQUIRED');
          },
        }}
        render={({ field }) => (
          <>
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">

            </label>
            <ReactQuill
              modules={{
                toolbar: [
                  [{ header: '1' }, { header: '2' }, { font: [] }],
                  [{ size: [] }],
                  ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                  [
                    { list: 'ordered' },
                    { list: 'bullet' },
                    { indent: '-1' },
                    { indent: '+1' },
                  ],
                  ['link', 'image', 'video'],
                  ['clean'],
                ],
              }}
              theme="snow"
              placeholder={placeholder}
              {...field}
              readOnly={readOnly}
              className='overflow-hidden bg-white dark:bg-black '
            />
            {errors?.[name] && <span className='text-sm text-red-500'>{errors?.[name]?.message}</span>}
          </>
        )}
      />
    </div>
  );
};

export default QuillEditor;
