import { useContext } from 'react';
import { ItemContext } from '../../../context/ItemContext';
import { PageNumContext } from '../../../context/PageNumContext';
import {
  S_SelectModalWrap,
  S_SelectModalContainer,
  S_SelectModalSpan,
} from './SelectBoxModal.style';

interface SelectBoxProps {
  isSelect: string;
  setIsSelect: (isSelect: string) => void;
}
function SelectBoxModal({ isSelect, setIsSelect }: SelectBoxProps) {
  const ITEM_CONTEXT = useContext(ItemContext);
  const PAGE_NUM_CONTENT = useContext(PageNumContext);

  const selectfilter = (type: string) => {
    ITEM_CONTEXT?.setItems([]);
    PAGE_NUM_CONTENT?.setPageNumber(1);
    setIsSelect(type);
  };

  return (
    <S_SelectModalWrap>
      <S_SelectModalContainer>
        <S_SelectModalSpan
          onClick={() => selectfilter('desc')}
          active={isSelect === 'desc'}
        >
          Newest
        </S_SelectModalSpan>
        <S_SelectModalSpan
          onClick={() => selectfilter('viewCount')}
          active={isSelect === 'viewCount'}
        >
          Popular
        </S_SelectModalSpan>
      </S_SelectModalContainer>
    </S_SelectModalWrap>
  );
}

export default SelectBoxModal;
