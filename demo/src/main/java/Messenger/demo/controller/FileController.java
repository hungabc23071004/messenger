package Messenger.demo.controller;

import Messenger.demo.constant.MinioPrefixConstant;
import Messenger.demo.service.FileService;
import Messenger.demo.dto.response.ApiResponse;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/file")
@RequiredArgsConstructor
@FieldDefaults(level = lombok.AccessLevel.PRIVATE, makeFinal = true)
public class FileController {
    FileService fileService;


    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ApiResponse<String> uploadFiles(@RequestParam("file") MultipartFile file) {
       return ApiResponse.<String>builder()
               .result(fileService.upload(file, MinioPrefixConstant.ATTACHMENTS) )
               .message("File uploaded successfully")
               .build();
    }
}
