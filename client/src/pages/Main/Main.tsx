import { useContext, useState, useEffect } from 'react';
import { Container, ContainerWrap } from '../../styles/Layout';
import MainImage from '../../assets/imgs/image1.jpg';
import SearchBar from '../../components/common/SearchBar/SearchBar';
import {
  S_MainContentBox,
  S_MainImg,
  S_MainImgBox,
  S_MainTextBox,
  S_SearchContentBox,
  S_SearchImgBox,
  S_MainTitle,
  S_MainImageContentBox,
} from './Main.styles';
import MainSkeleton from '../../components/common/Skeleton/MainSkeleton';
import ImageCardList from '../../components/common/ImageCardList/ImageCardList';
import { LoadingContext } from '../../context/LoadintContext';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login } from '../../store/authSlice';
import { socialLogin } from '../../api/Login';

function Main() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [activeTextBox, setActiveTextBox] = useState(true);
  const LOADING_CONTENT = useContext(LoadingContext);

  useEffect(() => {
    if (window.location.href.includes('userId')) {
      const { userId, userProfileImage } = socialLogin();
      dispatch(login({ userId, userProfileImage }));
      const url = window.location.href.split('?')[0];
      window.history.replaceState({}, document.title, url);
    }
  }, [navigate]);

  return (
    <ContainerWrap>
      <Container>
        <S_MainContentBox>
          <S_SearchContentBox>
            <SearchBar setActiveTextBox={setActiveTextBox} />
            <S_SearchImgBox textBoxActive={activeTextBox}>
              <ImageCardList width={240} height={180} />
            </S_SearchImgBox>
            <S_MainTextBox textBoxActive={activeTextBox}>
              <S_MainTitle>
                free pics.
                <br /> do anyhing (CC0). <br /> make magic
              </S_MainTitle>
            </S_MainTextBox>
          </S_SearchContentBox>
          <S_MainImageContentBox>
            {LOADING_CONTENT?.isLoading ? (
              <MainSkeleton count={2} />
            ) : (
              <>
                <S_MainImgBox>
                  <S_MainImg src={MainImage} alt="인기있는 이미지"></S_MainImg>
                </S_MainImgBox>
                <S_MainImgBox>
                  <S_MainImg src={MainImage} alt="인기있는 이미지"></S_MainImg>
                </S_MainImgBox>
              </>
            )}
          </S_MainImageContentBox>
        </S_MainContentBox>
      </Container>
    </ContainerWrap>
  );
}

export default Main;
