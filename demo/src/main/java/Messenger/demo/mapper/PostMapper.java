package Messenger.demo.mapper;

import Messenger.demo.dto.response.CommentResponse;
import Messenger.demo.dto.response.LikeResponse;
import Messenger.demo.model.Comment;
import Messenger.demo.model.Like;
import Messenger.demo.model.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface PostMapper {


    @Mapping(target = "authorName",
            expression = "java(user.getFullName())")
    @Mapping(target = "authorAvatar",
            expression = "java(user.getAvatarUrl() != null ? Messenger.demo.constant.MinIOPrefixUrl.MINIO_URL + user.getAvatarUrl() : null)")
    @Mapping(target = "id", source = "comment.id")
    CommentResponse toCommentResponse(Comment comment, User user );

    LikeResponse toLikeResponse(Like like);


}
