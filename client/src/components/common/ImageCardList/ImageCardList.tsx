import { useContext, useEffect, useRef, useState } from 'react';
import ImageCard from '../ImageCard/ImageCard';
import { S_ImageCardWrap, S_LoaderBar } from './ImageCardList.styles';
import { postSearchTags } from '../../../api/Search';
import { SearchContext } from '../../../context/SearchContext';
import { PageNumContext } from '../../../context/PageNumContext';
import { ImageContext } from '../../../context/ImageContext';
import ImageCardSkeleton from '../Skeleton/ImageCardSkeleton';
import { useLocation, useParams } from 'react-router-dom';
import useInfiniteScroll from '../../../hooks/useInfiniteScroll ';

export type ImageCardListProps = {
  width: number;
  height?: number;
  matrix?: 'columns' | 'rows';
  filter?: string;
};

export type ImageCardProps = {
  imageId: number;
  imageUrl: string;
  like: boolean;
  bookmark: boolean;
};

function ImageCardList({
  height,
  matrix = 'columns',
  filter = 'createdAt',
}: ImageCardListProps) {
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [loading, setLoading] = useState(true);

  const IMAGE_CONTEXT = useContext(ImageContext);
  const SEARCH_CONTEXT = useContext(SearchContext);
  const PAGE_NUM_CONTEXT = useContext(PageNumContext);

  const { search, id } = useParams();
  const { pathname } = useLocation();
  const isMain = pathname === '/';

  useEffect(() => {
    fetchData();
  }, [SEARCH_CONTEXT?.searchWord, PAGE_NUM_CONTEXT?.pageNumber, filter]);

  useInfiniteScroll(loading, hasMore);

  const fetchData = async () => {
    try {
      setLoading(true);
      const pageNumber = PAGE_NUM_CONTEXT?.pageNumber ?? 1;
      const searchWord = SEARCH_CONTEXT?.searchWord ?? '';
      const isDetailPage = pathname.includes('detail') && !isMain;

      const response = await postSearchTags(
        isMain ? searchWord : search ?? searchWord,
        pageNumber,
        filter,
      );

      const filterImages = isDetailPage
        ? response?.data.filter(
            (item: ImageCardProps) => item.imageId !== Number(id),
          )
        : response?.data;

      IMAGE_CONTEXT?.setItems((prev: ImageCardProps[]) => [
        ...prev,
        ...filterImages,
      ]);

      setHasMore(filterImages.length > 0);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <S_ImageCardWrap height={height} matrix={matrix}>
        {IMAGE_CONTEXT?.items.map((item: ImageCardProps, index) => (
          <ImageCard key={index} item={item} />
        )) ?? <S_LoaderBar>No more photos to load.</S_LoaderBar>}
      </S_ImageCardWrap>
      {/* 로딩 중일 때 */}
      {loading && (
        <>
          <ImageCardSkeleton count={6} height={height} />
          <S_LoaderBar>Loading more...</S_LoaderBar>
        </>
      )}

      {/* 검색 결과가 없을 때  | 받아올 데이터가 없을 때 */}
      {!hasMore && <S_LoaderBar>No more photos to load.</S_LoaderBar>}
      {/* 끝까지 스크롤 했을 때 */}
      {hasMore && <S_LoaderBar id="endElement"></S_LoaderBar>}
    </>
  );
}

export default ImageCardList;
