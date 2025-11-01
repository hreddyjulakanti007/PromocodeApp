package com.promocode.management.dto;

import com.promocode.management.model.DiscountType;
import com.promocode.management.model.PromoCodeStatus;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PromoCodeDTO {

    private Long id;

    @NotBlank(message = "Code is required")
    private String code;

    @NotNull(message = "Amount is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Amount must be greater than 0")
    private BigDecimal amount;

    @NotNull(message = "Discount type is required")
    private DiscountType discountType;

    @NotNull(message = "Expiry date is required")
    @Future(message = "Expiry date must be in the future")
    private LocalDateTime expiryDate;

    @Min(value = 0, message = "Usage limit must be 0 or greater")
    private Integer usageLimit;

    private Integer usageCount;

    @NotNull(message = "Status is required")
    private PromoCodeStatus status;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}
