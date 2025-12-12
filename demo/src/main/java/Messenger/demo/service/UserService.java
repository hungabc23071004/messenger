package Messenger.demo.service;

import Messenger.demo.constant.MinIOPrefixUrl;
import Messenger.demo.constant.MinioPrefixConstant;
import Messenger.demo.dto.request.UserAvatarRequest;
import Messenger.demo.dto.request.UserUpdateRequest;
import Messenger.demo.dto.response.UserResponse;
import Messenger.demo.dto.response.UserShortInfoResponse;
import Messenger.demo.exception.AppException;
import Messenger.demo.exception.ErrorCode;
import Messenger.demo.mapper.UserMapper;
import Messenger.demo.model.User;
import Messenger.demo.repository.UserRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class UserService {

    UserRepository userRepository;
    UserMapper userMapper;
    FileService fileService;

       public User getCurrentUser() {
        User user = userRepository.findById(SecurityContextHolder.getContext().getAuthentication().getName())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
        return user;
       }

    public UserResponse getMyInfor() {
        User user = getCurrentUser();
        return userMapper.toUserResponse(user);
    }

    public UserResponse updateMyInfor(UserUpdateRequest request) {
        User user = getCurrentUser();
        userMapper.updateUser(request, user);
        user = userRepository.save(user);
        return userMapper.toUserResponse(user);
    }

    public String  uploadAvatar(UserAvatarRequest request) {
           User user = getCurrentUser();
           if(user.getAvatarUrl() != null){
               fileService.delete(user.getAvatarUrl());
           }
           String url = fileService.upload(request.getFile(), MinioPrefixConstant.AVATARS);
           user.setAvatarUrl(url);
           userRepository.save(user);
           return MinIOPrefixUrl.MINIO_URL+ url;
    }

    public String uploadBanner(UserAvatarRequest request) {
           User user = getCurrentUser();
           if(user.getBannerUrl() != null){
               fileService.delete(user.getBannerUrl());
           }
           String url = fileService.upload(request.getFile(), MinioPrefixConstant.BANNERS);
           user.setBannerUrl(url);
           userRepository.save(user);
           return MinIOPrefixUrl.MINIO_URL+ url;
    }

    public UserResponse getUserById(String id) {
           return userRepository.findById(id)
                   .map(userMapper::toUserResponse)
                   .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
    }


    public List<UserShortInfoResponse> getUserShortInfoByIds(List<String> ids) {
           List<User> users = userRepository.findByIdIn(ids);
           return users.stream()
                   .map(userMapper::toShortInfoUserResponse)
                   .toList();
    }

}
