package com.photoday.photoday.follow.service;

import com.photoday.photoday.excpetion.CustomException;
import com.photoday.photoday.excpetion.ExceptionCode;
import com.photoday.photoday.follow.dto.FollowDto;
import com.photoday.photoday.follow.entity.Follow;
import com.photoday.photoday.follow.mapper.FollowMapper;
import com.photoday.photoday.follow.repository.FollowRepository;
import com.photoday.photoday.security.service.AuthUserService;
import com.photoday.photoday.user.entity.User;
import com.photoday.photoday.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class FollowServiceImpl implements FollowService {
    //TODO impl 폴더 만들어서 따로 넣어주기,  메서드 병합 : authUserService.getLoginUser(), ExceptionCode static 임포트로 통일하기.
    private final UserService userService;
    private final FollowRepository followRepository;
    private final FollowMapper followMapper;
    private final AuthUserService authUserService;

    @Override
    public FollowDto.ResponseFollowUsers findFollowUser(Long userId) {
        Long loginUserId = authUserService.getLoginUserId();
        User verifiedUser = userService.findVerifiedUser(userId);

        return followMapper.followUserListToResponseFollowUsers(verifiedUser, loginUserId);
    }

    @Override
    public FollowDto.ResponseFollowUsers registerFollowUser(Long followingId) {
        Long loginUserId = authUserService.getLoginUserId();
        if (followingId.equals(loginUserId)) {
            throw new CustomException(ExceptionCode.CANNOT_FOLLOW_MYSELF);
        }
        User user = userService.findVerifiedUser(loginUserId);
        User targetUser = userService.findVerifiedUser(followingId);

        Optional<Follow> check = followRepository.findByFollowerAndFollowing(targetUser, user);

        if (check.isPresent()) {
            user.getFollowing().remove(check.get());
            targetUser.getFollower().remove(check.get());

            followRepository.delete(check.get());
        } else {
            Follow follow = new Follow();
            follow.setFollower(targetUser);
            follow.setFollowing(user);

            followRepository.save(follow);
        }

        return followMapper.followUserListToResponseFollowUsers(targetUser, loginUserId);
    }
}
