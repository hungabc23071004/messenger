package Messenger.demo.mapper;

import Messenger.demo.dto.request.AccountRegisterRequest;
import Messenger.demo.dto.request.UserUpdateRequest;
import Messenger.demo.dto.response.UserResponse;
import Messenger.demo.dto.response.UserShortInfoResponse;
import Messenger.demo.model.User;
import org.mapstruct.*;

import java.util.List;

@Mapper(componentModel = "spring")
public interface UserMapper {
    User toUser(AccountRegisterRequest request);

    @Mapping(target = "avatarUrl",
            expression = "java(user.getAvatarUrl() != null ? Messenger.demo.constant.MinIOPrefixUrl.MINIO_URL + user.getAvatarUrl() : null)")
    @Mapping(target = "bannerUrl",
            expression = "java(user.getBannerUrl() != null ? Messenger.demo.constant.MinIOPrefixUrl.MINIO_URL + user.getBannerUrl() : null)")

    UserResponse toUserResponse(User user);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateUser(UserUpdateRequest request, @MappingTarget User user);

    List<UserResponse> toUserResponseList(List<User> users);

    @Mapping(target = "avatarUrl",
            expression = "java(user.getAvatarUrl() != null ? Messenger.demo.constant.MinIOPrefixUrl.MINIO_URL + user.getAvatarUrl() : null)")
    UserShortInfoResponse toShortInfoUserResponse(User user);


    List<UserShortInfoResponse> toShortInfoUserResponseList(List<User> users);
}
