package com.promocode.management.service;

import com.promocode.management.config.TenantContext;
import com.promocode.management.dto.PromoCodeDTO;
import com.promocode.management.dto.PromoCodeFilterDTO;
import com.promocode.management.exception.ResourceNotFoundException;
import com.promocode.management.model.PromoCode;
import com.promocode.management.repository.PromoCodeRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class PromoCodeService {

    private final PromoCodeRepository promoCodeRepository;

    @Transactional
    public PromoCodeDTO createPromoCode(PromoCodeDTO dto) {
        String tenantId = TenantContext.getTenantId();
        log.debug("Creating promo code for tenant: {}", tenantId);

        PromoCode promoCode = mapToEntity(dto);
        promoCode.setTenantId(tenantId);
        promoCode.setUsageCount(0);

        PromoCode saved = promoCodeRepository.save(promoCode);
        return mapToDTO(saved);
    }

    @Transactional
    public PromoCodeDTO updatePromoCode(Long id, PromoCodeDTO dto) {
        String tenantId = TenantContext.getTenantId();
        log.debug("Updating promo code {} for tenant: {}", id, tenantId);

        PromoCode promoCode = promoCodeRepository.findByIdAndTenantId(id, tenantId)
                .orElseThrow(() -> new ResourceNotFoundException("Promo code not found with id: " + id));

        promoCode.setCode(dto.getCode());
        promoCode.setAmount(dto.getAmount());
        promoCode.setDiscountType(dto.getDiscountType());
        promoCode.setExpiryDate(dto.getExpiryDate());
        promoCode.setUsageLimit(dto.getUsageLimit());
        promoCode.setStatus(dto.getStatus());

        PromoCode updated = promoCodeRepository.save(promoCode);
        return mapToDTO(updated);
    }

    @Transactional(readOnly = true)
    public PromoCodeDTO getPromoCodeById(Long id) {
        String tenantId = TenantContext.getTenantId();
        log.debug("Getting promo code {} for tenant: {}", id, tenantId);

        PromoCode promoCode = promoCodeRepository.findByIdAndTenantId(id, tenantId)
                .orElseThrow(() -> new ResourceNotFoundException("Promo code not found with id: " + id));

        return mapToDTO(promoCode);
    }

    @Transactional(readOnly = true)
    public List<PromoCodeDTO> getAllPromoCodes() {
        String tenantId = TenantContext.getTenantId();
        log.debug("Getting all promo codes for tenant: {}", tenantId);

        return promoCodeRepository.findByTenantId(tenantId).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<PromoCodeDTO> getPromoCodesByFilter(PromoCodeFilterDTO filter) {
        String tenantId = TenantContext.getTenantId();
        log.debug("Filtering promo codes for tenant: {}", tenantId);

        return promoCodeRepository.findByFilters(
                tenantId,
                filter.getCode(),
                filter.getStatus(),
                filter.getStartDate(),
                filter.getEndDate()).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public void deletePromoCode(Long id) {
        String tenantId = TenantContext.getTenantId();
        log.debug("Deleting promo code {} for tenant: {}", id, tenantId);

        PromoCode promoCode = promoCodeRepository.findByIdAndTenantId(id, tenantId)
                .orElseThrow(() -> new ResourceNotFoundException("Promo code not found with id: " + id));

        promoCodeRepository.delete(promoCode);
    }

    private PromoCodeDTO mapToDTO(PromoCode entity) {
        PromoCodeDTO dto = new PromoCodeDTO();
        dto.setId(entity.getId());
        dto.setCode(entity.getCode());
        dto.setAmount(entity.getAmount());
        dto.setDiscountType(entity.getDiscountType());
        dto.setExpiryDate(entity.getExpiryDate());
        dto.setUsageLimit(entity.getUsageLimit());
        dto.setUsageCount(entity.getUsageCount());
        dto.setStatus(entity.getStatus());
        dto.setCreatedAt(entity.getCreatedAt());
        dto.setUpdatedAt(entity.getUpdatedAt());
        return dto;
    }

    private PromoCode mapToEntity(PromoCodeDTO dto) {
        PromoCode entity = new PromoCode();
        entity.setCode(dto.getCode());
        entity.setAmount(dto.getAmount());
        entity.setDiscountType(dto.getDiscountType());
        entity.setExpiryDate(dto.getExpiryDate());
        entity.setUsageLimit(dto.getUsageLimit());
        entity.setStatus(dto.getStatus());
        return entity;
    }
}
