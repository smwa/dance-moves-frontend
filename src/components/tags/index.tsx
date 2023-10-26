import React from 'react';
import './index.css';
import { X } from 'react-feather';

function Tags(props: { tags: string[], onChange?: (tags: string[]) => void }) {
  const tags = props.tags;
  const onChange = props.onChange;
  const editable = (typeof props.onChange !== 'undefined');

  const remove = (tag: string) => {
    if (!editable || typeof onChange === 'undefined') return;
    onChange(tags.filter((_tag) => _tag !== tag));
  };

  return (
    <div className="TagsContainer">
      {tags.map((tag) => (
        <div key={tag}>
          <div>{tag}</div>
          {!editable ? null : (
            <button onClick={() => {remove(tag);}}>
              <X size={'100%'} />
            </button>
          )}
        </div>
      ))}
    </div>
  );
}

export default Tags;
