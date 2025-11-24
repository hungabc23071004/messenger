package Messenger.demo.mapper;

import Messenger.demo.dto.request.AccountRegisterRequest;
import Messenger.demo.dto.request.UserUpdateRequest;
import Messenger.demo.dto.response.UserResponse;
import Messenger.demo.model.User;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface UserMapper {
    User toUser(AccountRegisterRequest request);

    UserResponse toUserResponse(User user);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateUser(UserUpdateRequest request, @MappingTarget User user);
}
