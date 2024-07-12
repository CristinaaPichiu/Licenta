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

    @PostMapping("/saveOrUpdateItem")
    public ResponseEntity<ToDoItem> saveOrUpdateToDoItem(@RequestBody ToDoItemDTO toDoItemDTO) {
        ToDoItem savedToDoItem = toDoItemService.createOrUpdateToDoItem(toDoItemDTO);
        return ResponseEntity.ok(savedToDoItem);
    }

    @GetMapping("/byJob/{jobId}")
    public ResponseEntity<List<ToDoItem>> getToDoItemsByJobId(@PathVariable Integer jobId) {
        List<ToDoItem> items = toDoItemService.findToDoItemsByJobId(jobId);
        if (items.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(items);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteToDoItem(@PathVariable Integer id) {
        try {
            toDoItemService.deleteToDoItem(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
}
