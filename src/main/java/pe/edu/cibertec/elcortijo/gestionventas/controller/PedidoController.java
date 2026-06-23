package pe.edu.cibertec.elcortijo.gestionventas.controller;

import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import pe.edu.cibertec.elcortijo.gestionventas.dto.DetallePedidoDto;
import pe.edu.cibertec.elcortijo.gestionventas.dto.NuevoPedidoDto;
import pe.edu.cibertec.elcortijo.gestionventas.dto.PedidoCompletoDto;
import pe.edu.cibertec.elcortijo.gestionventas.dto.PedidoResumenDto;
import pe.edu.cibertec.elcortijo.gestionventas.entity.ComprobanteEntity;
import pe.edu.cibertec.elcortijo.gestionventas.entity.PedidoEntity;
import pe.edu.cibertec.elcortijo.gestionventas.service.PedidoService;
import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/pedidos")
@AllArgsConstructor
public class PedidoController {

    private final PedidoService pedidoService;

    @GetMapping
    public ResponseEntity<List<PedidoResumenDto>> listarPedidos() {
        List<PedidoEntity> pedidos = pedidoService.getAll();

        pedidos.sort((p1, p2) -> {
            int dateComparison = p2.getFecha().compareTo(p1.getFecha());
            if (dateComparison == 0) {
                return p2.getHora().compareTo(p1.getHora());
            }
            return dateComparison;
        });

        List<PedidoResumenDto> dtos = pedidos.stream()
                .map(this::convertirAPedidoResumenDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    private PedidoResumenDto convertirAPedidoResumenDto(PedidoEntity pedido) {
        String nombreCliente = pedido.getCliente().getNombre() + " " + pedido.getCliente().getApellido();
        ComprobanteEntity comprobante = pedido.getComprobante();
        
        BigDecimal total;
        if (comprobante != null) {
            total = comprobante.getTotal();
        } else {
            total = pedido.getDetalles().stream()
                    .map(detalle -> detalle.getSubtotal())
                    .reduce(BigDecimal.ZERO, BigDecimal::add);
        }

        return new PedidoResumenDto(
                pedido.getIdPedido(),
                nombreCliente,
                pedido.getFecha(),
                pedido.getHora(),
                pedido.getEstadoPedido().getNombreEstado(),
                getBadgeForStatus(pedido.getEstadoPedido().getNombreEstado()),
                total
        );
    }

    private String getBadgeForStatus(String nombreEstado) {
        return switch (nombreEstado.toLowerCase()) {
            case "pendiente" -> "status-badge-warning";
            case "en preparación" -> "status-badge-info";
            case "listo para despacho" -> "status-badge-info";
            case "despachado" -> "status-badge-success";
            case "cancelado" -> "status-badge-danger";
            default -> "status-badge-secondary";
        };
    }

    @GetMapping("/{id}")
    public ResponseEntity<PedidoCompletoDto> obtenerPedidoPorId(@PathVariable Integer id) {
        PedidoEntity pedido = pedidoService.getById(id);
        if (pedido == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(convertirAPedidoCompletoDto(pedido));
    }

    private PedidoCompletoDto convertirAPedidoCompletoDto(PedidoEntity pedido) {
        List<DetallePedidoDto> detallesDto = pedido.getDetalles().stream()
                .map(detalle -> new DetallePedidoDto(
                        detalle.getProducto().getNombre(),
                        detalle.getCantidad(),
                        detalle.getPrecioUnitarioVenta(),
                        detalle.getSubtotal()
                ))
                .collect(Collectors.toList());

        ComprobanteEntity comprobante = pedido.getComprobante();
        BigDecimal total;
        if (comprobante != null) {
            total = comprobante.getTotal();
        } else {
            total = pedido.getDetalles().stream()
                    .map(detalle -> detalle.getSubtotal())
                    .reduce(BigDecimal.ZERO, BigDecimal::add);
        }

        return new PedidoCompletoDto(
                pedido.getIdPedido(),
                pedido.getFecha(),
                pedido.getHora(),
                pedido.getCliente().getNombre() + " " + pedido.getCliente().getApellido(),
                pedido.getCliente().getDni(),
                pedido.getCliente().getDireccion(),
                pedido.getEmpleadoVendedor().getNombre() + " " + pedido.getEmpleadoVendedor().getApellido(),
                pedido.getEstadoPedido().getNombreEstado(),
                detallesDto,
                total
        );
    }

    @PostMapping
    public ResponseEntity<?> crearPedido(@RequestBody NuevoPedidoDto nuevoPedidoDto) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String dniVendedor = authentication.getName();

            PedidoEntity pedidoCreado = pedidoService.crearNuevoPedido(nuevoPedidoDto, dniVendedor);

            return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("idPedido", pedidoCreado.getIdPedido()));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

}