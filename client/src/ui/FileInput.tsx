// @flow
import * as React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import { IMAGE_URL } from '../../config.ts';

interface Props extends React.HTMLProps<HTMLInputElement> {
  image?: string;
}
export const FileInput = (props: Props) => {
  const [file, setFile] = useState<File | null>();
  const [preview, setPreview] = useState<string | null>(
    null,
  );
  return (
    <label
      className={`${props.className ?? ''} py-2 flex items-center w-96 max-w-full`}
    >
      {preview ? (
        <img
          src={preview}
          alt="preview"
          className={`w-14 h-14`}
        />
      ) : props.image ? (
        <img
          className={`w-14 h-14`}
          alt={`preview photo`}
          src={`${IMAGE_URL}/${props.image}`}
        />
      ) : (
        <span>
          <FontAwesomeIcon
            icon={faImage}
            className={
              'text-light-text-secondary dark:text-dark-text-secondary text-2xl'
            }
            width={80}
          />
        </span>
      )}
      <span className={`ml-3`}>
        {file?.name ?? 'Select file'}
      </span>
      <input
        {...props}
        type={'file'}
        className={'hidden'}
        accept={'image/*'}
        onChange={(e) => {
          const selectedFile = (
            e.target as HTMLInputElement
          ).files?.[0];
          if (selectedFile) {
            setFile(selectedFile);
            setPreview(URL.createObjectURL(selectedFile));
          }
          props.onChange && props.onChange(e);
        }}
      />
    </label>
  );
};
