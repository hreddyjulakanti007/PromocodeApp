package com.promocode.management.controller;

import com.promocode.management.dto.PromoCodeDTO;
import com.promocode.management.dto.PromoCodeFilterDTO;
import com.promocode.management.service.PromoCodeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/promo-codes")
@RequiredArgsConstructor
public class PromoCodeController {

    private final PromoCodeService promoCodeService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<PromoCodeDTO> createPromoCode(@Valid @RequestBody PromoCodeDTO promoCodeDTO) {
        log.info("Creating promo code: {}", promoCodeDTO.getCode());
        PromoCodeDTO created = promoCodeService.createPromoCode(promoCodeDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<PromoCodeDTO> updatePromoCode(
            @PathVariable Long id,
            @Valid @RequestBody PromoCodeDTO promoCodeDTO) {
        log.info("Updating promo code: {}", id);
        PromoCodeDTO updated = promoCodeService.updatePromoCode(id, promoCodeDTO);
        return ResponseEntity.ok(updated);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'BUSINESS')")
    public ResponseEntity<PromoCodeDTO> getPromoCode(@PathVariable Long id) {
        log.info("Getting promo code: {}", id);
        PromoCodeDTO promoCode = promoCodeService.getPromoCodeById(id);
        return ResponseEntity.ok(promoCode);
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'BUSINESS')")
    public ResponseEntity<List<PromoCodeDTO>> getAllPromoCodes() {
        log.info("Getting all promo codes");
        List<PromoCodeDTO> promoCodes = promoCodeService.getAllPromoCodes();
        return ResponseEntity.ok(promoCodes);
    }

    @PostMapping("/filter")
    @PreAuthorize("hasAnyRole('ADMIN', 'BUSINESS')")
    public ResponseEntity<List<PromoCodeDTO>> filterPromoCodes(@RequestBody PromoCodeFilterDTO filter) {
        log.info("Filtering promo codes");
        List<PromoCodeDTO> promoCodes = promoCodeService.getPromoCodesByFilter(filter);
        return ResponseEntity.ok(promoCodes);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deletePromoCode(@PathVariable Long id) {
        log.info("Deleting promo code: {}", id);
        promoCodeService.deletePromoCode(id);
        return ResponseEntity.noContent().build();
    }
}
