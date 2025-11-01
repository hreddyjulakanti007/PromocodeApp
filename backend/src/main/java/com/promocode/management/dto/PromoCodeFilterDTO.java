package com.promocode.management.dto;

import com.promocode.management.model.PromoCodeStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PromoCodeFilterDTO {

    private String code;

    private PromoCodeStatus status;

    private LocalDateTime startDate;

    private LocalDateTime endDate;
}
