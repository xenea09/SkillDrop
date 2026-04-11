package ch.skilldrop.backend.dto;
import lombok.Data;

@Data
public class SubscribeRequest {
    private String paymentMethodId;
    private String priceId;
}
