package com.cristina.security.controller;

import com.cristina.security.dto.ToDoItemDTO;
import com.cristina.security.entity.ToDoItem;
import com.cristina.security.service.ToDoItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/todoItems")
public class ToDoItemController {

    @Autowired
    private ToDoItemService toDoItemService;

    @PostMapping("/saveItem")
    public ResponseEntity<ToDoItem> createToDoItem(@RequestBody ToDoItemDTO toDoItemDTO) {
        ToDoItem createdToDoItem = toDoItemService.createToDoItem(toDoItemDTO);
        return ResponseEntity.ok(createdToDoItem);
    }

    // Endpoint pentru a prelua toate ToDoItems asociate unui anumit job
    @GetMapping("/byJob/{jobId}")
    public ResponseEntity<List<ToDoItem>> getToDoItemsByJobId(@PathVariable Integer jobId) {
        List<ToDoItem> items = toDoItemService.findToDoItemsByJobId(jobId);
        if (items.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(items);
    }
}
